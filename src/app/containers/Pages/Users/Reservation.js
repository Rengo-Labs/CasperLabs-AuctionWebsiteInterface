// React
import React, { createContext, useContext, useEffect, useState } from "react";
// Components
import HeaderHome, {
  CHAINS,
  SUPPORTED_NETWORKS
} from "../../../components/Headers/Header";
import { AppContext } from "../../App/Application";
// Material UI
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
// Bootstrap
import "../../../assets/css/bootstrap.min.css";
// Custom Styling
import "../../../assets/css/stakingStyles.css";
import { makeLiquidityTransformerDeployWasm } from '../../../components/blockchain/MakeDeploy/MakeDeployWasm';

// getMyTokens
// Casper SDK
// import Torus from "@toruslabs/casper-embed";
import Axios from "axios";
import {
  CasperServiceByJsonRPC,
  CLByteArray, CLPublicKey,
  CLValueBuilder,
  RuntimeArgs
} from "casper-js-sdk";
import { useSnackbar } from "notistack";
import { Container } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { LIQUIDITYTRANSFORMER_CONTRACT_HASH, LIQUIDITYTRANSFORMER_PACKAGE_HASH } from "../../../components/blockchain/AccountHashes/Addresses";
import { getDeploy } from "../../../components/blockchain/GetDeploy/GetDeploy";
import { makeDeploy } from "../../../components/blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../../components/blockchain/SignDeploy/SignDeploy";
import Mode1Cashback from "../../../components/Cards/ReservationCards/Mode1Cashback";
import Mode2DailyRandom from "../../../components/Cards/ReservationCards/Mode2DailyRandom";
import Mode3Rookie from "../../../components/Cards/ReservationCards/Mode3Rookie";
import Mode4Leader from "../../../components/Cards/ReservationCards/Mode4Leader";
import Mode5Master from "../../../components/Cards/ReservationCards/Mode5Master";
import Mode6Grand from "../../../components/Cards/ReservationCards/Mode6Grand";
import { convertToStr } from "../../../components/ConvertToString/ConvertToString";
import GlobalDataHeader from "../../../components/Headers/GlobalDataHeader";
import ReserveWiseModal from "../../../components/Modals/ReserveWiseModal";
import SigningModal from "../../../components/Modals/SigningModal";
import { Avatar, CardHeader, Grid } from "@mui/material";

// Content
const handleStakingWISEModal = createContext();
const handleStakingCSPRModal = createContext();



// Component Function
function Reservation() {
  // States
  const [openSigning, setOpenSigning] = useState(false);
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const { activePublicKey } = useContext(AppContext);
  const [cookies, setCookie] = useCookies(["refree"]);
  const [userWiseBalance, setUserWiseBalance] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const [globalReservationDaysData, setGlobalReservationDaysData] = useState();
  const [userReservationDaysData, setUserReservationDaysData] = useState();
  const [claimWiseStatus, setClaimWiseStatus] = useState(false);


  const [totalUsersReservations, setTotalUsersReservations] = useState(0);


  console.log("cookies", cookies);

  // Handlers

  const [openReservationModal, setOpenReservationModal] = useState(false);
  const handleCloseReservationModal = () => {
    setOpenReservationModal(false);
  };
  const handleShowReservationModal = () => {
    setOpenReservationModal(true);
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
    const controller=new AbortController()
    getGlobalData();
    return () => {
      controller.abort()
    }
  }, []);

  function getGlobalData() {
    Axios
      .get("/getGlobalData")
      .then((res) => {
        console.log("getGlobalData", res);
        setGlobalData(res.data.globalData[0]);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }
  useEffect(() => {
    const controller=new AbortController()
    getData()
    return () => {
      controller.abort()
    }
  }, [activePublicKey]);



  function getData() {
    Axios
      .get("/globalReservationDaysData")
      .then((res) => {
        console.log("globalReservationDaysData", res);
        console.log("globalReservationDaysData", res.data.globalReservationDaysData);
        setGlobalReservationDaysData(res.data.globalReservationDaysData);
      })
      .catch((error) => {
        setGlobalReservationDaysData([]);
        console.log(error);
        console.log(error.response);
      });



    if (
      activePublicKey &&
      activePublicKey !== null &&
      activePublicKey !== "null" &&
      activePublicKey !== undefined
    ) {
      Axios
        .get(`/userReservationDaysData/${Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")}`)
        .then((res) => {
          console.log("userReservationDaysData", res);
          console.log("userReservationDaysData", res.data.userReservationDaysData);
          let totalUsersReservations = 0
          for (let i = 0; i < res.data.userReservationDaysData.length; i++) {
            totalUsersReservations = totalUsersReservations / 1 + res.data.userReservationDaysData[i].effectiveWei / 1;
          }
          setTotalUsersReservations(totalUsersReservations)
          setUserReservationDaysData(res.data.userReservationDaysData);
        })
        .catch((error) => {
          setUserReservationDaysData([]);
          console.log(error);
          console.log(error.response);
        });
      Axios
        .get(`/getClaimWiseStatus/${Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")}`)
        .then((res) => {
          console.log("claimWiseStatus", res);
          console.log("claimWiseStatus", res.data.claimWiseStatus);

          setClaimWiseStatus(res.data.claimWiseStatus);
        })
        .catch((error) => {
          setClaimWiseStatus(false);
          console.log(error);
          console.log(error.response);
        });
    }
  }
  function findIndexOfDay(array, user) {
    console.log("array, user", array, user);
    if (user) return array?.map(object => Number(object.user)).indexOf(user);
    else return -1;
  }
  const { enqueueSnackbar } = useSnackbar();

  async function reserveWiseMakeDeploy(
    reservationAmount,

  ) {
    handleShowSigning();
    console.log("reservationAmount", reservationAmount);
    const publicKeyHex = activePublicKey;
    if (reservationAmount <= 0.001) {
      let variant = "Error";
      enqueueSnackbar("Minimum Reservation amount should be greater than 0.001 Caspers.", { variant });
      handleCloseSigning();
      return
    }
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      console.log("checking staking active Key: ", activePublicKey);
      const ltPackageHash = new CLByteArray(
        Uint8Array.from(Buffer.from(LIQUIDITYTRANSFORMER_PACKAGE_HASH, "hex"))
      );
      const investmentMode = 1;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          package_hash: CLValueBuilder.key(ltPackageHash),
          amount: CLValueBuilder.u512(convertToStr(reservationAmount)),
          investment_mode: CLValueBuilder.u8(investmentMode),
          entrypoint: CLValueBuilder.string("reserve_wise"),
        });
        console.log("runtimeArgs", runtimeArgs);

        //   // Set contract installation deploy (unsigned).
        let deploy = await makeLiquidityTransformerDeployWasm(
          publicKey,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          // if (selectedWallet === "Casper") {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);
          // } else {
          //   // let Torus = new Torus();
          //   torus = new Torus();
          //   console.log("torus", torus);
          //   await torus.init({
          //     buildEnv: "testing",
          //     showTorusButton: true,
          //     network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
          //   });
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
          // }
          handleCloseSigning();
          let variant = "success";
          getData()
          getGlobalData()
          enqueueSnackbar("Wise Reserved Successfully!", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Reserve Wise!", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Unable to Reserve Wise", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Casper Signer Please", { variant });
    }
  }


  async function claimWiseMakeDeploy(
  ) {
    handleShowSigning();
    // console.log("reservationAmount", reservationAmount);
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      console.log("checking staking active Key: ", activePublicKey);
      const ltPackageHash = new CLByteArray(
        Uint8Array.from(Buffer.from(LIQUIDITYTRANSFORMER_PACKAGE_HASH, "hex"))
      );
      const investmentMode = 1;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
        });

        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(LIQUIDITYTRANSFORMER_CONTRACT_HASH, "hex")
        );
        let entryPoint = "get_my_tokens";
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
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
          Axios
            .post("/claimWise", {
              user: Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex")
            })
            .then((res) => {
              console.log("claimWise", res);
              getData()
            })
            .catch((error) => {
              console.log(error);
              console.log(error.response);
            })
          enqueueSnackbar("Wise Claimed Succesfully", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Claim Wise", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Unable to Claim Wise", { variant });
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
            selectedNav={"Reservation"}
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
              <CurrencyExchangeIcon fontSize="large" />
            </div>
          </div>
          <div className="row no-gutters ml-3 align-items-center">
            <section>
              <h1 className="text-dark font-weight-bold m-0 wiseStaking-heading">
                Wise Reservation
              </h1>
              <p className="m-0 text-muted wiseStaking-caption">
                All Reservation Days
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

      </div>
      <Container style={{ paddingTop: '10px' }}>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            {globalReservationDaysData !== null && globalReservationDaysData !== undefined ? (
              <Grid
                container
                spacing={6}
                direction="row"
                justifyContent="flex-start"
              // alignItems="flex-start"
              >
                <Mode1Cashback handleShowReservationModal={handleShowReservationModal} globalReservationDaysData={globalReservationDaysData} userReservationDaysData={userReservationDaysData} claimWiseMakeDeploy={claimWiseMakeDeploy} globalData={globalData} findIndexOfDay={findIndexOfDay} totalUsersReservations={totalUsersReservations} claimWiseStatus={claimWiseStatus} />
                <Mode2DailyRandom day={1} handleShowReservationModal={handleShowReservationModal} setSelectedDate={setSelectedDate} setSelectedDay={setSelectedDay} findIndexOfDay={findIndexOfDay} globalReservationDaysData={globalReservationDaysData} userReservationDaysData={userReservationDaysData} claimWiseMakeDeploy={claimWiseMakeDeploy} />
                <Mode3Rookie day={1} handleShowReservationModal={handleShowReservationModal} setSelectedDate={setSelectedDate} setSelectedDay={setSelectedDay} findIndexOfDay={findIndexOfDay} globalReservationDaysData={globalReservationDaysData} userReservationDaysData={userReservationDaysData} claimWiseMakeDeploy={claimWiseMakeDeploy} />
                <Mode4Leader day={1} handleShowReservationModal={handleShowReservationModal} setSelectedDate={setSelectedDate} setSelectedDay={setSelectedDay} findIndexOfDay={findIndexOfDay} globalReservationDaysData={globalReservationDaysData} userReservationDaysData={userReservationDaysData} claimWiseMakeDeploy={claimWiseMakeDeploy} />
                <Mode5Master day={1} handleShowReservationModal={handleShowReservationModal} setSelectedDate={setSelectedDate} setSelectedDay={setSelectedDay} findIndexOfDay={findIndexOfDay} globalReservationDaysData={globalReservationDaysData} userReservationDaysData={userReservationDaysData} claimWiseMakeDeploy={claimWiseMakeDeploy} />
                <Mode6Grand day={1} handleShowReservationModal={handleShowReservationModal} setSelectedDate={setSelectedDate} setSelectedDay={setSelectedDay} findIndexOfDay={findIndexOfDay} globalReservationDaysData={globalReservationDaysData} userReservationDaysData={userReservationDaysData} claimWiseMakeDeploy={claimWiseMakeDeploy} />
              </Grid>
            ) : (null)}
          </div>
        </div>
      </Container>

      < footer style={{ height: "3rem", width: "100%" }
      }></footer >
      <ReserveWiseModal
        show={openReservationModal}
        handleClose={handleCloseReservationModal}
        selectedDate={selectedDate}
        selectedDay={selectedDay}
        reserveWiseMakeDeploy={reserveWiseMakeDeploy}
        findIndexOfDay={findIndexOfDay}
        globalReservationDaysData={globalReservationDaysData}
        globalData={globalData}
      />
      <SigningModal show={openSigning} />
    </div >
  );
}

export default Reservation;
export { handleStakingWISEModal, handleStakingCSPRModal };
