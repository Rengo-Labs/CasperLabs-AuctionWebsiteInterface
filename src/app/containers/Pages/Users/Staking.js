// React
import React, { useEffect } from "react";
import { useState, createContext, useContext } from "react";
// Components
import HeaderHome, {
  CHAINS,
  SUPPORTED_NETWORKS,
} from "../../../components/Headers/Header";
import WiseStakingTabs from "../../../components/Tabs/WiseStakingTabs";
import { AppContext } from "../../App/Application";
// Material UI
import AccessAlarmTwoToneIcon from "@mui/icons-material/AccessAlarmTwoTone";
// Bootstrap
import "../../../assets/css/bootstrap.min.css";
// Custom Styling
import "../../../assets/css/stakingStyles.css";
import StakingWISEModal from "../../../components/Modals/StakingWISEModal";
import StakingCSPRModal from "../../../components/Modals/StakingCSPRModal";
// Casper SDK
import {
  AccessRights,
  CasperServiceByJsonRPC,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLList,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import { WISE_CONTRACT_HASH, WISE_PACKAGE_HASH } from "../../../components/blockchain/AccountHashes/Addresses";
import { convertToStr } from "../../../components/ConvertToString/ConvertToString";
import { makeDeploy } from "../../../components/blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../../../components/blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../../../components/blockchain/PutDeploy/PutDeploy";
import { getDeploy } from "../../../components/blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import { createRecipientAddress } from '../../../components/blockchain/RecipientAddress/RecipientAddress';
import { useSnackbar } from "notistack";
// import Torus from "@toruslabs/casper-embed";
import { useCookies } from "react-cookie";
import GlobalDataHeader from "../../../components/Headers/GlobalDataHeader";
import Axios from "axios";
import SigningModal from "../../../components/Modals/SigningModal";
import StakeHistoricalSummaryModal from "../../../components/Modals/StakeHistoricalSummaryModal";
import { makeWiseTokenDeployWasm } from "../../../components/blockchain/MakeDeploy/MakeDeployWasm";
import { getStateRootHash } from "../../../components/blockchain/GetStateRootHash/GetStateRootHash";
import { balanceOf } from "../../../components/JsClients/WISETOKEN/wiseTokenFunctionsForBackend/functions";
import { Avatar, CardHeader } from "@mui/material";

// Content
const handleStakingWISEModal = createContext();
const handleStakingCSPRModal = createContext();

// Component Function
function Staking() {
  // States
  const [openHistoricalSummaryModal, setOpenHistoricalSummaryModal] = useState(false);
  const [openStakingWISEModal, setOpenStakingWISEModal] = useState(false);
  const [openStakingCSPRModal, setOpenStakingCSPRModal] = useState(false);
  const [openSigning, setOpenSigning] = useState(false);
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const { activePublicKey } = useContext(AppContext);
  const [cookies, setCookie] = useCookies(["refree"]);
  const [userWiseBalance, setUserWiseBalance] = useState(0);
  const [userCsprBalance, setUserCsprBalance] = useState(0);

  console.log("cookies", cookies);
  // Handlers
  const handleCloseStakingWISEModal = () => {
    setOpenStakingWISEModal(false);
  };
  const handleShowStakingWISEModal = () => {
    setOpenStakingWISEModal(true);
  };

  const handleCloseHistoricalSummaryModal = () => {
    setOpenHistoricalSummaryModal(false);
  };
  const handleShowHistoricalSummaryModal = () => {
    setOpenHistoricalSummaryModal(true);
  };

  const handleCloseStakingCSPRModal = () => {
    setOpenStakingCSPRModal(false);
  };
  const handleShowStakingCSPRModal = () => {
    setOpenStakingCSPRModal(true);
  };
  // let [torus, setTorus] = useState();

  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  const [globalData, setGlobalData] = useState({});



  useEffect(() => {
    getGlobalData()

  }, []);
  async function getGlobalData() {
    Axios
      .get("/getGlobalData")
      .then((res) => {
        setGlobalData(res.data.globalData[0]);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }

  let [stakeData, setStakeData] = useState([])
  let [stakeDetail, setStakeDetail] = useState()

  useEffect(() => {
    const controller = new AbortController()
    let publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      getStakeData()
    }
    // let count = 0;
    // const interval = setInterval(() => {
    //   setProgress(count);
    //   count++;
    // }, 100);
    // return () => clearInterval(interval);

    return () => {
      controller.abort()
    }
  }, [activePublicKey]);

  async function getStakeData() {
    Axios
      .get(`/getStakeData/${Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")}`)
      .then((res) => {
        // console.log("getStakeData", res.data);
        console.log("getStakeData", res.data.stakesData);
        setStakeData(res.data.stakesData.reverse());
        // console.log("stakeData", stakeData);
        // console.log("stakeData.startDayTimeStamp", stakeData[0].startDayTimeStamp);
        // console.log("lockDaysSeconds", stakeData[0].lockDaysSeconds);
        // let lastDay = stakeData[0].startDayTimeStamp + stakeData[0].lockDaysSeconds
        // let currentTImeStamp = Math.floor(Date.now() / 1000);
        // let pct = (100 * lastDay / currentTImeStamp).toFixed(2)
        // console.log("lastDay", lastDay);
        // console.log("currentTImeStamp", currentTImeStamp);
        // console.log("pct", pct);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }
  const { enqueueSnackbar } = useSnackbar();

  async function createStakeMakeDeploy(
    stakingAmount,
    stakingDuration,
    referrerAddress,
    isCspr,
    mainPurse
  ) {
    handleShowSigning();
    console.log("stakingAmount", stakingAmount);
    console.log("stakingDuration", stakingDuration);
    console.log("referrerAddress", referrerAddress);
    console.log("isCspr", isCspr);
    console.log("mainPurse", mainPurse);
    const publicKeyHex = activePublicKey;
    if (referrerAddress == publicKeyHex) {
      let variant = "Error";
      enqueueSnackbar("You cannot be your Referrer.", { variant });
      handleCloseSigning();
      return
    }
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = isCspr ? 20000000000 : 10000000000;
      console.log("checking staking active Key: ", activePublicKey);
      console.log("referrerAddress", referrerAddress);
      const accountHash = Buffer.from(CLPublicKey.fromHex(referrerAddress).toAccountHash()).toString("hex");
      console.log("accountHash", accountHash);
      const referrerAddressByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(accountHash, "hex"))
      );
      const wiseTokenPackageHash = new CLByteArray(
        Uint8Array.from(Buffer.from(WISE_PACKAGE_HASH, "hex"))
      );
      // console.log("createRecipientAddress(referrerAddressByteArray)", createRecipientAddress(referrerAddressByteArray));
      try {
        const runtimeArgs = isCspr
          ? (RuntimeArgs.fromMap({
            package_hash: CLValueBuilder.key(wiseTokenPackageHash),
            amount: CLValueBuilder.u512(convertToStr(stakingAmount)),
            lock_days: CLValueBuilder.u64(stakingDuration),
            referrer: stakingDuration < 360 ? (new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex"))))) : ((new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(accountHash, "hex")))))),
            entrypoint: CLValueBuilder.string("create_stake_with_cspr")
          }))
          : (RuntimeArgs.fromMap({
            package_hash: CLValueBuilder.key(wiseTokenPackageHash),
            staked_amount: CLValueBuilder.u256(convertToStr(stakingAmount)),
            lock_days: CLValueBuilder.u64(stakingDuration),
            referrer: stakingDuration < 360 ? (new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex"))))) : ((new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(accountHash, "hex")))))),
            entrypoint: CLValueBuilder.string("create_stake"),
          }));

        console.log("runtimeArgs", runtimeArgs);
        let deploy = await makeWiseTokenDeployWasm(
          publicKey,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);
          Axios
            .get(`/queryKeyData/${Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")}/${isCspr ? "create_stake_with_cspr" : "create_stake"}`)
            .then((res) => {
              console.log("res.data.Data", res.data.Data);

            })
            .catch((error) => {
              console.log(error);
              console.log(error.response);
            });

          getGlobalData();
          getStakeData();
          handleCloseStakingWISEModal();
          handleCloseStakingCSPRModal();
          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Stake Created Successfully!", { variant });



        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Create Stake!", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Unable to Create Stake", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Casper Signer Please", { variant });
    }
  }
  function convertToIntArray(hex) {
    console.log("hex", hex);
    if (hex != undefined) {
      let array = [];
      let indexedVal = '';
      for (let index = 1; index < hex.length; index++) {
        // if (hex[index] >= 0 && hex[index] <= 9)
        if (hex[index] == ',' || hex[index] == ']') {
          console.log("indexedVal", indexedVal);
          array.push(parseInt(indexedVal))
          indexedVal = ""
        } else {

          indexedVal = indexedVal + hex[index]
          console.log("hex[index]", hex[index]);
        }
      }
      return array
    }
  }


  async function scrapeRewardsMakeDeploy(stakeData, scrapeDays) {
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    console.log(activePublicKey);
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 10000000000;
      try {
        console.log(stakeData);
        let stakeId = convertToIntArray(stakeData.id)
        console.log("stakeId", stakeId);
        console.log("scrapeDays", scrapeDays);
        let vec32Array = [];
        for (let i = 0; i < stakeId.length; i++) {
          const p = CLValueBuilder.u32(stakeId[i]);
          vec32Array.push(p);
        }
        console.log("stakeIdstakeId", vec32Array);
        const wiseTokenPackageHash = new CLByteArray(
          Uint8Array.from(Buffer.from(WISE_PACKAGE_HASH, "hex"))
        );
        const runtimeArgs = RuntimeArgs.fromMap({
          package_hash: CLValueBuilder.key(wiseTokenPackageHash),
          stake_id: new CLList(vec32Array),
          scrape_days: CLValueBuilder.u64(scrapeDays),
          entrypoint: CLValueBuilder.string("scrape_interest"),
        });
        let deploy = await makeWiseTokenDeployWasm(
          publicKey,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        console.log(selectedWallet);
        try {
          // if (selectedWallet === "Casper") {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);
          // } else {
          //   torus = new Torus();
          //   console.log("torus", torus);
          //   await torus.init({
          //     buildEnv: "testing",
          //     showTorusButton: true,
          //     network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
          //   });
          //   console.log("Torus123", torus);
          //   console.log("torus", torus.provider);
          //   const casperService = new CasperServiceByJsonRPC(torus?.provider);
          //   const deployRes = await casperService.deploy(deploy);
          //   console.log("deployRes", deployRes.deploy_hash);
          //   console.log(
          //     `... Contract installation deployHash: ${deployRes.deploy_hash}`
          //   );
          //   let result = await getDeploy(
          //     NODE_ADDRESS,
          //     deployRes.deploy_hash,
          //     enqueueSnackbar
          //   );
          //   console.log(
          //     `... Contract installed successfully.`,
          //     JSON.parse(JSON.stringify(result))
          //   );
          //   console.log("result", result);
          // }
          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Rewards Scraped Succesfully", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Scrape Rewards", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Something went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Casper Signer Please", { variant });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setSelectedWallet={setSelectedWallet}
            setUserWiseBalance={setUserWiseBalance}
            selectedWallet={selectedWallet}
            // setTorus={setTorus}
            selectedNav={"Staking"}
          />

          <div
            className=""
            style={{ paddingTop: "100px" }}
            position="absolute"
          ></div>
          <span className="d-flex justify-content-center">
            <GlobalDataHeader globalData={globalData}
            />
          </span>
          <div
            className=""
            style={{ paddingTop: "50px" }}
            position="absolute"
          ></div>
        </div>
      </div>
      {/* /Header */}
      {/* Body */}
      <div className="container-fluid mx-auto">
        <div className="row no-gutters" >
          <div className="card shadow m-0 rounded-lg">
            <div className="card-body accessAlarm">
              <AccessAlarmTwoToneIcon fontSize="large" />
            </div>
          </div>
          <div className="row no-gutters ml-3 align-items-center">
            <section>
              <h1 className="text-dark font-weight-bold m-0 wiseStaking-heading">
                Wise Staking
              </h1>
              <p className="m-0 text-muted wiseStaking-caption">
                Time-lock your funds to earn interest
              </p>
            </section>
          </div>
          <div className="row no-gutters ml-auto align-items-center">
            <section >
              <h1 className="text-dark font-weight-bold m-0 wiseStaking-heading">
                {localStorage.getItem("Address") !== null && localStorage.getItem("Address") !== undefined && localStorage.getItem("Address") !== 'null' ? (
                  <CardHeader
                    avatar={<Avatar src="" aria-label="User" />}
                    title={<a
                      href={
                        "https://testnet.cspr.live/account/" +
                        localStorage.getItem("Address")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" align-items-center justify-content-center text-center"
                      style={{ color: "#ea3429" }}
                    >
                      <span style={{ cursor: "pointer" }}>
                        {localStorage.getItem("Address").slice(0, 10)}. . .
                      </span>
                    </a>}
                    subheader={`Total: ${userWiseBalance} WISE`}
                  />
                ) : (null)}


              </h1>
            </section>
          </div>
        </div>
        <handleStakingWISEModal.Provider value={handleShowStakingWISEModal}>
          <handleStakingCSPRModal.Provider value={handleShowStakingCSPRModal}>
            <WiseStakingTabs stakeData={stakeData} setStakeDetail={setStakeDetail} handleShowHistoricalSummaryModal={handleShowHistoricalSummaryModal} />
          </handleStakingCSPRModal.Provider>
        </handleStakingWISEModal.Provider>
      </div>
      <footer style={{ height: "3rem", width: "100%" }}></footer>
      <StakingWISEModal
        show={openStakingWISEModal}
        userWiseBalance={userWiseBalance}
        globalData={globalData}
        handleClose={handleCloseStakingWISEModal}
        createStakeMakeDeploy={createStakeMakeDeploy}
      />
      <StakingCSPRModal
        show={openStakingCSPRModal}
        userCsprBalance={userCsprBalance}
        globalData={globalData}
        handleClose={handleCloseStakingCSPRModal}
        createStakeMakeDeploy={createStakeMakeDeploy}
      />
      <StakeHistoricalSummaryModal
        show={openHistoricalSummaryModal}
        userWiseBalance={userWiseBalance}
        globalData={globalData}
        handleClose={handleCloseHistoricalSummaryModal}
        scrapeRewardsMakeDeploy={scrapeRewardsMakeDeploy}
        stakeDetail={stakeDetail}
      />
      <SigningModal show={openSigning} />

    </div>
  );
}

export default Staking;
export { handleStakingWISEModal, handleStakingCSPRModal };
