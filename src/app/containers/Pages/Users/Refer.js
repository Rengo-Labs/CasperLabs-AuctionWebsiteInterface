import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Button,
} from "@material-ui/core/";
import toast, { Toaster } from "react-hot-toast";
import { Modal } from "react-bootstrap";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { StyledEngineProvider } from "@mui/styled-engine";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FilterListIcon from "@mui/icons-material/FilterList";
// import { FaSitemap } from 'react-icons/fa';
import LanIcon from "@mui/icons-material/Lan";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Torus from "@toruslabs/casper-embed";
import axios from "axios";
import {
  AccessRights,
  CasperServiceByJsonRPC,
  CLByteArray,
  CLKey,
  CLOption,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import { AppContext } from "../../App/Application";
import { useSnackbar } from "notistack";
import numeral from "numeral";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Some } from "ts-results";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from "../../../assets/img/cspr.png";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import {
  ROUTER_CONTRACT_HASH,
  ROUTER_PACKAGE_HASH,
} from "../../../components/blockchain/AccountHashes/Addresses";
import { getDeploy } from "../../../components/blockchain/GetDeploy/GetDeploy";
import { getStateRootHash } from "../../../components/blockchain/GetStateRootHash/GetStateRootHash";
import { makeDeploy } from "../../../components/blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../../../components/blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../../../components/blockchain/SignDeploy/SignDeploy";
import { convertToStr } from "../../../components/ConvertToString/ConvertToString";
import HeaderHome, {
  CHAINS,
  SUPPORTED_NETWORKS,
} from "../../../components/Headers/Header";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));
const regex = /^\s*-?(\d+(\.\d{1,9})?|\.\d{1,9})\s*$/;

function Refer(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  let [mainPurse, setMainPurse] = useState();
  let [tokenA, setTokenA] = useState();
  let [tokenB, setTokenB] = useState();
  let [tokenAAmount, setTokenAAmount] = useState(0);
  let [tokenBAmount, setTokenBAmount] = useState(0);
  let [tokenABalance, setTokenABalance] = useState(0);
  let [tokenBBalance, setTokenBBalance] = useState(0);
  let [approveAIsLoading, setApproveAIsLoading] = useState(false);
  let [approveBIsLoading, setApproveBIsLoading] = useState(false);
  let [tokenAAllowance, setTokenAAllowance] = useState(0);
  let [tokenBAllowance, setTokenBAllowance] = useState(0);
  let [isInvalidPair, setIsInvalidPair] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [isTokenList, setIsTokenList] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [ratio0, setRatio0] = useState(1);
  const [ratio1, setRatio1] = useState(1);
  const [reserve0, setReserve0] = useState(1);
  const [reserve1, setReserve1] = useState(1);
  const [openSlippage, setOpenSlippage] = useState(false);
  const { activePublicKey, setActivePublicKey } = useContext(AppContext);

  const handleCloseSlippage = () => {
    setOpenSlippage(false);
  };
  const handleShowSlippage = () => {
    setOpenSlippage(true);
  };
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  const [openTokenAModal, setOpenTokenAModal] = useState(false);
  const handleCloseTokenAModal = () => {
    setOpenTokenAModal(false);
  };
  const handleShowTokenAModal = () => {
    setOpenTokenAModal(true);
  };
  const [openTokenBModal, setOpenTokenBModal] = useState(false);
  const handleCloseTokenBModal = () => {
    setOpenTokenBModal(false);
  };
  const handleShowTokenBModal = () => {
    setOpenTokenBModal(true);
  };
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  let [liquidity, setLiquidity] = useState();

  console.log("selectedWallet", selectedWallet);
  const resetData = () => {
    getTokenData();
    setTokenA();
    setTokenB();
    setTokenAAmount(0);
    setTokenBAmount(0);
    setTokenABalance(0);
    setTokenBBalance(0);
    setTokenAAllowance(0);
    setTokenBAllowance(0);
    setReserve0(1);
    setReserve1(1);
  };

  const getTokenData = useCallback(() => {
    axios
      .get("/tokensList")
      .then(async (res) => {
        console.log("tokensList", res);
        console.log(res.data.tokens);
        let CSPR = {
          address: "",
          chainId: 1,
          decimals: 9,
          logoURI: Logo,
          name: "Casper",
          symbol: "CSPR",
        };
        const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
        getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
          console.log("stateRootHash", stateRootHash);
          client
            .getBlockState(
              stateRootHash,
              CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
              []
            )
            .then((result) => {
              console.log("result", result.Account.mainPurse);
              try {
                const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
                client
                  .getAccountBalance(stateRootHash, result.Account.mainPurse)
                  .then((result) => {
                    console.log("CSPR balance", result.toString());
                    CSPR.balance = result.toString();
                  });
              } catch (error) {
                CSPR.balance = 0;
                console.log("error", error);
              }
            });
        });
        console.log("CSPR", CSPR);
        let holdArr = res.data.tokens;
        console.log("holdArr", holdArr);
        for (let i = 0; i < holdArr.length; i++) {
          let param = {
            contractHash: holdArr[i].address.slice(5),
            user: Buffer.from(
              CLPublicKey.fromHex(activePublicKey).toAccountHash()
            ).toString("hex"),
          };
          await axios
            .post("/balanceagainstuser", param)
            .then((res) => {
              console.log("balanceagainstuser", res);
              console.log(res.data);
              holdArr[i].balance = res.data.balance;
              // setTokenBBalance(res.data.balance)
            })
            .catch((error) => {
              console.log(error);
              console.log(error.response);
            });
        }
        holdArr.splice(0, 0, CSPR);
        console.log("holdArr", holdArr);
        setTokenList(res.data.tokens);
        setIsTokenList(true);
        // setTokenList(oldArray => [...oldArray, CSPR])
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }, [activePublicKey]);
  useEffect(() => {
    if (
      activePublicKey !== "null" &&
      activePublicKey !== null &&
      activePublicKey !== undefined
    ) {
      getTokenData();
    }
  }, [getTokenData, activePublicKey]);
  useEffect(() => {
    if (tokenA && tokenB) {
      if (tokenA.name === tokenB.name) {
        setIsInvalidPair(true);
        setReserve0(1);
        setReserve1(1);
      } else if (
        (tokenA.symbol === "CSPR" && tokenB.symbol === "WCSPR") ||
        (tokenB.symbol === "CSPR" && tokenA.symbol === "WCSPR")
      ) {
        setIsInvalidPair(true);
        setReserve0(1);
        setReserve1(1);
      } else {
        let pathParamsArr = [tokenA.symbol, tokenB.symbol];
        if (tokenA.symbol === "CSPR") {
          pathParamsArr[0] = "WCSPR";
        } else if (tokenB.symbol === "CSPR") {
          pathParamsArr[1] = "WCSPR";
        }

        let pathResParam = {
          path: pathParamsArr,
        };
        console.log("pathResParam", pathResParam);
        axios
          .post("/getpathreserves", pathResParam)
          .then((res) => {
            console.log("getpathreserves", res);
            if (res.data.reserve0 && res.data.reserve1) {
              setRatio0(res.data.reserve0);
              setRatio1(res.data.reserve1);
              axios
                .get("/getpairlist")
                .then((res1) => {
                  console.log("resresres", res1);
                  console.log(res1.data.pairList);
                  if (tokenA.name !== "Casper" && tokenB.name !== "Casper") {
                    for (let i = 0; i < res1.data.pairList.length; i++) {
                      let address0 =
                        res1.data.pairList[i].token0.id.toLowerCase();
                      let address1 =
                        res1.data.pairList[i].token1.id.toLowerCase();
                      console.log("address0", address0);
                      console.log("address1", address1);
                      if (
                        address0.toLowerCase() ===
                          tokenA.address.slice(5).toLowerCase() &&
                        address1.toLowerCase() ===
                          tokenB.address.slice(5).toLowerCase()
                      ) {
                        setIsInvalidPair(false);
                        liquiditySetter(res1.data.pairList[i]);
                        getUserReservers(
                          res1.data.pairList[i],
                          res.data.reserve0,
                          res.data.reserve1
                        );
                        break;
                      } else if (
                        address0.toLowerCase() ===
                          tokenB.address.slice(5).toLowerCase() &&
                        address1.toLowerCase() ===
                          tokenA.address.slice(5).toLowerCase()
                      ) {
                        setIsInvalidPair(false);
                        liquiditySetter(res1.data.pairList[i]);
                        getUserReservers(
                          res1.data.pairList[i],
                          res.data.reserve0,
                          res.data.reserve1
                        );
                        break;
                      } else {
                        setIsInvalidPair(true);
                        setReserve0(1);
                        setReserve1(1);
                      }
                    }
                  } else {
                    for (let i = 0; i < res1.data.pairList.length; i++) {
                      let name0 = res1.data.pairList[i].token0.name;
                      let name1 = res1.data.pairList[i].token1.name;
                      if (
                        name0 === "Wrapped Casper" &&
                        tokenA.name === "Casper" &&
                        tokenB.name === name1
                      ) {
                        console.log("1", res1.data.pairList[i]);
                        setIsInvalidPair(false);
                        liquiditySetter(res1.data.pairList[i]);
                        getUserReservers(
                          res1.data.pairList[i],
                          res.data.reserve0,
                          res.data.reserve1
                        );
                        break;
                      } else if (
                        name0 === "Wrapped Casper" &&
                        tokenB.name === "Casper" &&
                        tokenA.name === name1
                      ) {
                        console.log("2", res1.data.pairList[i]);
                        setIsInvalidPair(false);
                        liquiditySetter(res1.data.pairList[i]);
                        getUserReservers(
                          res1.data.pairList[i],
                          res.data.reserve0,
                          res.data.reserve1
                        );
                        break;
                      } else if (
                        name1 === "Wrapped Casper" &&
                        tokenA.name === "Casper" &&
                        tokenB.name === name0
                      ) {
                        console.log("3", res1.data.pairList[i]);
                        setIsInvalidPair(false);
                        liquiditySetter(res1.data.pairList[i]);
                        getUserReservers(
                          res1.data.pairList[i],
                          res.data.reserve0,
                          res.data.reserve1
                        );
                        break;
                      } else if (
                        name1 === "Wrapped Casper" &&
                        tokenB.name === "Casper" &&
                        tokenA.name === name0
                      ) {
                        console.log("4", res1.data.pairList[i]);
                        setIsInvalidPair(false);
                        liquiditySetter(res1.data.pairList[i]);
                        getUserReservers(
                          res1.data.pairList[i],
                          res.data.reserve0,
                          res.data.reserve1
                        );
                        break;
                      } else {
                        setIsInvalidPair(true);
                        setReserve0(1);
                        setReserve1(1);
                      }
                    }
                  }
                })
                .catch((error) => {
                  console.log(error);
                  console.log(error.response);
                });
            } else {
              setRatio0(1);
              setRatio1(1);
            }
          })
          .catch((error) => {
            setRatio0(1);
            setRatio1(1);
            console.log(error);
            console.log(error.response);
          });
      }
    }
    function getUserReservers(pair, rat0, rat1) {
      let param = {
        user: Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex"),
      };
      axios
        .post("/getpairagainstuser", param)
        .then((res) => {
          console.log("resresres", res);
          console.log("res.data", res.data);
          console.log("res.data.userpairs", res.data.userpairs);
          console.log("res.data.pairsdata", res.data.pairsdata);
          console.log("res.data.userpairs.length", res.data.userpairs.length);
          for (let i = 0; i < res.data.userpairs.length; i++) {
            // console.log("res.data.userpairs[i].pair", res.data.userpairs[i].pair);
            console.log("pair", pair);

            if (pair.id === res.data.userpairs[i].pair) {
              if (
                rat0 < rat1 &&
                parseInt(res.data.userpairs[i].reserve0) <
                  parseInt(res.data.userpairs[i].reserve1)
              ) {
                console.log("1");
                setReserve0(res.data.userpairs[i].reserve1 / 10 ** 9);
                setReserve1(res.data.userpairs[i].reserve0 / 10 ** 9);
              } else if (
                rat0 < rat1 &&
                parseInt(res.data.userpairs[i].reserve0) >
                  parseInt(res.data.userpairs[i].reserve1)
              ) {
                console.log("2");
                setReserve0(res.data.userpairs[i].reserve0 / 10 ** 9);
                setReserve1(res.data.userpairs[i].reserve1 / 10 ** 9);
              } else if (
                rat0 > rat1 &&
                parseInt(res.data.userpairs[i].reserve0) <
                  parseInt(res.data.userpairs[i].reserve1)
              ) {
                console.log("3");
                setReserve0(res.data.userpairs[i].reserve0 / 10 ** 9);
                setReserve1(res.data.userpairs[i].reserve1 / 10 ** 9);
              } else if (
                rat0 > rat1 &&
                parseInt(res.data.userpairs[i].reserve0) >
                  parseInt(res.data.userpairs[i].reserve1)
              ) {
                console.log("4");
                setReserve0(res.data.userpairs[i].reserve1 / 10 ** 9);
                setReserve1(res.data.userpairs[i].reserve0 / 10 ** 9);
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
        });
    }
    function liquiditySetter(pair) {
      let param = {
        to: Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex"),
        pairid: pair.id,
      };
      console.log(
        "await Signer.getSelectedPublicKeyBase64()",
        Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex")
      );
      axios
        .post("/liquidityagainstuserandpair", param)
        .then((res1) => {
          console.log("liquidityagainstuserandpair", res1);
          setLiquidity(parseFloat(res1.data.liquidity).toFixed(9));
          console.log("res1.data.liquidity", res1.data.liquidity);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
        });
    }
  }, [activePublicKey, tokenA, tokenB]);

  async function approveMakeDeploy(contractHash, amount, tokenApproved) {
    handleShowSigning();
    console.log("contractHash", contractHash);
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const spender = ROUTER_PACKAGE_HASH;
      const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          spender: createRecipientAddress(spenderByteArray),
          amount: CLValueBuilder.u256(convertToStr(amount)),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(contractHash.slice(5), "hex")
        );
        let entryPoint = "approve";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          if (tokenApproved === "tokenA") {
            setTokenAAllowance(amount * 10 ** 9);
          } else {
            setTokenBAllowance(amount * 10 ** 9);
          }
          // console.log('result', result);
          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Approved Successfully", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Approve", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Input values are too large", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Casper Signer Please", { variant });
    }
  }
  const getTokenBalance = useCallback(() => {
    let balanceParam = {
      contractHash: tokenA.address.slice(5),
      user: Buffer.from(
        CLPublicKey.fromHex(activePublicKey).toAccountHash()
      ).toString("hex"),
    };
    axios
      .post("/balanceagainstuser", balanceParam)
      .then((res) => {
        console.log("tokenAbalanceagainstuser", res);
        console.log(res.data);
        setTokenABalance(res.data.balance);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });

    let allowanceParam = {
      contractHash: tokenA.address.slice(5),
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: ROUTER_PACKAGE_HASH,
    };
    console.log("allowanceParam0", allowanceParam);
    axios
      .post("/allowanceagainstownerandspender", allowanceParam)
      .then((res) => {
        console.log("allowanceagainstownerandspender", res);
        console.log(res.data);
        setTokenAAllowance(res.data.allowance);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }, [activePublicKey, tokenA]);
  const getCurrencyBalance = useCallback(() => {
    const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
    getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
      console.log("stateRootHash", stateRootHash);
      client
        .getBlockState(
          stateRootHash,
          CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
          []
        )
        .then((result) => {
          console.log("result", result.Account.mainPurse);
          setMainPurse(result.Account.mainPurse);
          try {
            const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
            client
              .getAccountBalance(stateRootHash, result.Account.mainPurse)
              .then((result) => {
                console.log("CSPR balance", result.toString());
                setTokenABalance(result.toString());
              });
          } catch (error) {
            console.log("error", error);
          }
        });
    });
  }, [activePublicKey]);
  useEffect(() => {
    if (tokenA && tokenA.name !== "Casper" && activePublicKey) {
      getTokenBalance();
    }
    if (
      tokenA &&
      tokenA.name === "Casper" &&
      activePublicKey !== "null" &&
      activePublicKey !== null &&
      activePublicKey !== undefined
    ) {
      getCurrencyBalance();
    }
  }, [getTokenBalance, getCurrencyBalance, activePublicKey, tokenA]);

  useEffect(() => {
    if (tokenB && tokenB.name !== "Casper" && activePublicKey) {
      let balanceParam = {
        contractHash: tokenB.address.slice(5),
        user: Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex"),
      };
      axios
        .post("/balanceagainstuser", balanceParam)
        .then((res) => {
          console.log("tokenAbalanceagainstuser", res);
          console.log(res.data);
          setTokenBBalance(res.data.balance);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
        });

      let allowanceParam = {
        contractHash: tokenB.address.slice(5),
        owner: CLPublicKey.fromHex(activePublicKey)
          .toAccountHashStr()
          .slice(13),
        spender: ROUTER_PACKAGE_HASH,
      };
      console.log("allowanceParam0", allowanceParam);
      axios
        .post("/allowanceagainstownerandspender", allowanceParam)
        .then((res) => {
          console.log("allowanceagainstownerandspender", res);
          console.log(res.data);
          setTokenBAllowance(res.data.allowance);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
        });
    }
    if (
      tokenB &&
      tokenB.name === "Casper" &&
      activePublicKey !== "null" &&
      activePublicKey !== null &&
      activePublicKey !== undefined
    ) {
      const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
      getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
        console.log("stateRootHash", stateRootHash);
        client
          .getBlockState(
            stateRootHash,
            CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
            []
          )
          .then((result) => {
            console.log("result", result.Account.mainPurse);
            setMainPurse(result.Account.mainPurse);
            try {
              const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
              client
                .getAccountBalance(stateRootHash, result.Account.mainPurse)
                .then((result) => {
                  console.log("CSPR balance", result.toString());
                  setTokenBBalance(result.toString());
                });
            } catch (error) {
              console.log("error", error);
            }
          });
      });
    }
  }, [activePublicKey, tokenB]);

  useEffect(() => {
    if (
      activePublicKey !== "null" &&
      activePublicKey !== null &&
      activePublicKey !== undefined
    ) {
      const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
      getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
        console.log("stateRootHash", stateRootHash);
        console.log(
          "CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),",
          CLPublicKey.fromHex(activePublicKey).toAccountHashStr()
        );
        client
          .getBlockState(
            stateRootHash,
            CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
            []
          )
          .then((result) => {
            console.log("result", result.Account.mainPurse);
            setMainPurse(result.Account.mainPurse);
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response);
          });
      });
    }
  }, [activePublicKey]);
  async function addLiquidityMakeDeploy() {
    handleShowSigning();
    setIsLoading(true);
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const caller = ROUTER_CONTRACT_HASH;
      const tokenAAddress = tokenA.address;
      const tokenBAddress = tokenB.address;
      const token_AAmount = tokenAAmount;
      const token_BAmount = tokenBAmount;
      const deadline = 1739598100811;
      const paymentAmount = 10000000000;
      const _token_a = new CLByteArray(
        Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
      );
      const _token_b = new CLByteArray(
        Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
      );
      const pair = new CLByteArray(
        Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
      );
      if (tokenA.name === "Casper") {
        try {
          const runtimeArgs = RuntimeArgs.fromMap({
            token: new CLKey(_token_b),
            amount_cspr_desired: CLValueBuilder.u256(
              convertToStr(token_AAmount)
            ),
            amount_token_desired: CLValueBuilder.u256(
              convertToStr(token_BAmount)
            ),
            amount_cspr_min: CLValueBuilder.u256(
              convertToStr(
                Number(
                  token_AAmount - (token_AAmount * slippage) / 100
                ).toFixed(9)
              )
            ),
            amount_token_min: CLValueBuilder.u256(
              convertToStr(
                Number(
                  token_BAmount - (token_BAmount * slippage) / 100
                ).toFixed(9)
              )
            ),
            to: createRecipientAddress(activePublicKey),
            purse: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
            deadline: CLValueBuilder.u256(deadline),
            pair: new CLOption(Some(new CLKey(pair))),
          });
          let contractHashAsByteArray = Uint8Array.from(
            Buffer.from(caller, "hex")
          );
          let entryPoint = "add_liquidity_cspr_js_client";
          // Set contract installation deploy (unsigned).
          let deploy = await makeDeploy(
            publicKey,
            contractHashAsByteArray,
            entryPoint,
            runtimeArgs,
            paymentAmount
          );
          console.log("make deploy: ", deploy);
          try {
            if (selectedWallet === "Casper") {
              let signedDeploy = await signdeploywithcaspersigner(
                deploy,
                publicKeyHex
              );
              let result = await putdeploy(signedDeploy, enqueueSnackbar);
              console.log("result", result);
            } else {
              // let Torus = new Torus();
              torus = new Torus();
              console.log("torus", torus);
              await torus.init({
                buildEnv: "testing",
                showTorusButton: true,
                network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
              });
              console.log("Torus123", torus);
              console.log("torus", torus.provider);
              const casperService = new CasperServiceByJsonRPC(torus?.provider);
              const deployRes = await casperService.deploy(deploy);
              console.log("deployRes", deployRes.deploy_hash);
              console.log(
                `... Contract installation deployHash: ${deployRes.deploy_hash}`
              );
              let result = await getDeploy(
                NODE_ADDRESS,
                deployRes.deploy_hash,
                enqueueSnackbar
              );
              console.log(
                `... Contract installed successfully.`,
                JSON.parse(JSON.stringify(result))
              );
              console.log("result", result);
            }
            setTokenAAllowance(0);
            setTokenBAllowance(0);
            setTokenAAmount(0);
            setTokenBAmount(0);
            getCurrencyBalance();
            handleCloseSigning();
            let variant = "success";
            enqueueSnackbar("Liquidity Added Successfully", { variant });
            setIsLoading(false);
            resetData();
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Unable to Add Liquidity", { variant });
            setIsLoading(false);
          }
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Input values are too large", { variant });
          setIsLoading(false);
        }
      } else if (tokenB.name === "Casper") {
        try {
          const runtimeArgs = RuntimeArgs.fromMap({
            token: new CLKey(_token_a),
            amount_cspr_desired: CLValueBuilder.u256(
              convertToStr(token_BAmount)
            ),
            amount_token_desired: CLValueBuilder.u256(
              convertToStr(token_AAmount)
            ),
            amount_cspr_min: CLValueBuilder.u256(
              convertToStr(
                Number(
                  token_BAmount - (token_BAmount * slippage) / 100
                ).toFixed(9)
              )
            ),
            amount_token_min: CLValueBuilder.u256(
              convertToStr(
                Number(
                  token_AAmount - (token_AAmount * slippage) / 100
                ).toFixed(9)
              )
            ),
            to: createRecipientAddress(activePublicKey),
            purse: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
            deadline: CLValueBuilder.u256(deadline),
            pair: new CLOption(Some(new CLKey(_token_a))),
          });

          let contractHashAsByteArray = Uint8Array.from(
            Buffer.from(caller, "hex")
          );
          let entryPoint = "add_liquidity_cspr_js_client";

          // Set contract installation deploy (unsigned).
          let deploy = await makeDeploy(
            publicKey,
            contractHashAsByteArray,
            entryPoint,
            runtimeArgs,
            paymentAmount
          );
          console.log("make deploy: ", deploy);
          try {
            if (selectedWallet === "Casper") {
              let signedDeploy = await signdeploywithcaspersigner(
                deploy,
                publicKeyHex
              );
              let result = await putdeploy(signedDeploy, enqueueSnackbar);
              console.log("result", result);
            } else {
              // let Torus = new Torus();
              torus = new Torus();
              console.log("torus", torus);
              await torus.init({
                buildEnv: "testing",
                showTorusButton: true,
                network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
              });
              console.log("Torus123", torus);
              console.log("torus", torus.provider);
              const casperService = new CasperServiceByJsonRPC(torus?.provider);
              const deployRes = await casperService.deploy(deploy);
              console.log("deployRes", deployRes.deploy_hash);
              console.log(
                `... Contract installation deployHash: ${deployRes.deploy_hash}`
              );
              let result = await getDeploy(
                NODE_ADDRESS,
                deployRes.deploy_hash,
                enqueueSnackbar
              );
              console.log(
                `... Contract installed successfully.`,
                JSON.parse(JSON.stringify(result))
              );
              console.log("result", result);
            }
            setTokenAAllowance(0);
            setTokenBAllowance(0);
            setTokenAAmount(0);
            setTokenBAmount(0);
            getCurrencyBalance();
            handleCloseSigning();
            let variant = "success";
            enqueueSnackbar("Liquidity Added Successfully", { variant });
            setIsLoading(false);
            resetData();
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Unable to Add Liquidity", { variant });
            setIsLoading(false);
          }
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Input values are too large", { variant });
          setIsLoading(false);
        }
      } else {
        // eslint-disable-next-line
        console.log(
          "token_AAmount",
          (token_AAmount - (token_AAmount * slippage) / 100).toFixed(9)
        );
        console.log(
          "token_BAmount",
          token_BAmount - (token_BAmount * slippage) / 100
        );
        // try {
        const runtimeArgs = RuntimeArgs.fromMap({
          token_a: new CLKey(_token_a),
          token_b: new CLKey(_token_b),
          amount_a_desired: CLValueBuilder.u256(convertToStr(token_AAmount)),
          amount_b_desired: CLValueBuilder.u256(convertToStr(token_BAmount)),
          amount_a_min: CLValueBuilder.u256(
            convertToStr(
              Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(
                9
              )
            )
          ),
          amount_b_min: CLValueBuilder.u256(
            convertToStr(
              Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(
                9
              )
            )
          ),
          to: createRecipientAddress(activePublicKey),
          deadline: CLValueBuilder.u256(deadline),
          pair: new CLOption(Some(new CLKey(pair))),
        });

        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(caller, "hex")
        );
        let entryPoint = "add_liquidity_js_client";

        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          let variant = "success";

          handleCloseSigning();
          enqueueSnackbar("Liquidity Added Successfully", { variant });
          setIsLoading(false);
          resetData();
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Add Liquidity", { variant });
          setIsLoading(false);
        }
        // } catch {
        //   handleCloseSigning();
        //   let variant = "Error";
        //   enqueueSnackbar("Input values are too large", { variant });
        //   setIsLoading(false);
        // }
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Casper Signer Please", { variant });
      setIsLoading(false);
    }
  }
  const [table, setTable] = useState(0);
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
            selectedNav={"Refer"}
          />
          <div
            className="content"
            style={{ paddingTop: "100px" }}
            position="absolute"
          ></div>
          <div>
            <div className="container-fluid mx-auto">
              <div className="d-flex">
                {/* <div className="refer-icon mt-2 mb-3"> */}
                <div className="card shadow m-0 rounded-lg">
                  <div className="card-body accessAlarm">
                    <RecordVoiceOverIcon fontSize="large" />
                  </div>
                </div>
                {/* </div> */}
                <div className="row no-gutters ml-3 align-items-center">
                  <section>
                    <h1 className="text-dark font-weight-bold m-0 wiseStaking-heading">
                      Wise Referrals
                    </h1>
                    <p className="m-0 text-muted wiseStaking-caption">
                      Stakes opened with your referral address
                    </p>
                  </section>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between bb">
                  <div className="d-flex">
                    <div
                      className=" ml-2 my-4 px-3 pt-3 "
                      style={{
                        backgroundColor: "#484DA4",
                        borderRadius: "500px",
                      }}
                    >
                      <h5 className="text-white">0%</h5>
                    </div>
                    <div className="ml-2">
                      <p className="text-secondary pt-3">status not achieved</p>
                      <h4 className="text-dark">Critical Mass Referrer</h4>
                    </div>
                  </div>
                  <div className="d-flex mr-2">
                    <div className="refer-table-icon my-4">
                      <AddBoxIcon fontSize="small" />
                    </div>
                    <div className="refer-table-icon my-4">
                      <FilterListIcon fontSize="small" />
                    </div>
                    <div className="refer-table-icon my-4">
                      <AutorenewIcon fontSize="small" />
                    </div>
                  </div>
                </div>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  <TableContainer sx={{ p: 3 }}>
                    <Table aria-label="Wise Staking">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REFFERED STAKE START
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REFFERAL SPIN
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            {" "}
                            CONTRIBUTOR
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            {" "}
                            REFFERAL ID
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            STAKE ID
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REFFERED AMOUNT
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REWARDS/SHARES
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            ACTIONS
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody></TableBody>
                    </Table>
                    <div className="pt-5 text-center">
                      <div className="mx-auto w-100">
                        <div className="row no-gutters justify-content-center align-items-center">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              height: 80,
                              width: 80,
                              backgroundColor: "#eceef7",
                              borderRadius: "50%",
                            }}
                          >
                            <LanIcon
                              sx={{
                                color: "rgb(234, 52, 41)",
                                fontSize: "44px",
                              }}
                            />
                          </div>
                        </div>
                        <h3 className="pt-5" style={{ color: "#EA3429" }}>
                          You don't have critical mass referrer status yet
                        </h3>
                        <h5 className="text-dark">
                          Start{" "}
                          <span className="font-weight-bold">promoting</span>{" "}
                          Wise by creating your{" "}
                          <span className="font-weight-bold">
                            referral link
                          </span>
                        </h5>
                        <button
                          onClick={() => setModalShow(true)}
                          className="my-3 tableBtn"
                        >
                          Create Wise Refferal Link
                        </button>
                        <Modal
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          className="text-white"
                        >
                          <Modal.Header
                            closeButton
                            style={{ backgroundColor: "white" }}
                          >
                            <Modal.Title
                              id="contained-modal-title-vcenter"
                              style={{ marginLeft: "40%", color: "#484DA4" }}
                            >
                              Your Refferal Link
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="text-dark">
                            <p className="text-center">
                              Stakes opened through this link will generate
                              rewards for staker and referrer. To participate
                              you must have CM referrer status by referring
                              total of $10,000 equivalent in WISE stakes.
                            </p>
                            <p className="text-center">
                              Note: referrer rewards are only generated for
                              stakes with minimum duration of 365 days.
                            </p>

                            {activePublicKey === null ? (
                              <h4 className="text-center">
                                {" "}
                                https://wisetoken.net/?w=YOUR-WALLET-ADDRESS
                              </h4>
                            ) : (
                              <h4 className="text-center">
                                https://wisetoken.net/?w={activePublicKey}
                              </h4>
                            )}
                          </Modal.Body>
                          <Modal.Footer>
                            {activePublicKey === null ? (
                              <div className="mx-auto">
                                <button
                                  disabled
                                  className="btn disabled"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      activePublicKey
                                    );
                                  }}
                                >
                                  Copy Refferal Link
                                </button>
                              </div>
                            ) : (
                              <div className="mx-auto">
                                <button
                                  className="tableBtn"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      "https://wisetoken.net/?w=" +
                                        activePublicKey
                                    );
                                    toast.success(
                                      "Successfully Copied wallet",
                                      { id: "copyActivePublicKey" }
                                    );
                                  }}
                                >
                                  Copy Refferal Link
                                </button>
                                <Toaster />
                              </div>
                            )}
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </div>
                  </TableContainer>
                  <StyledEngineProvider injectFirst>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      className="MuiTablePagination "
                    />
                  </StyledEngineProvider>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Refer;
