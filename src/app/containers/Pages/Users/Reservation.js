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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
// Bootstrap
import "../../../assets/css/bootstrap.min.css";
// Custom Styling
import "../../../assets/css/stakingStyles.css";
import { Grid } from '@material-ui/core/';
import { makeDeployWasm } from '../../../components/blockchain/MakeDeploy/MakeDeployWasm';
import StakingWISEModal from "../../../components/Modals/StakingWISEModal";
import StakingCSPRModal from "../../../components/Modals/StakingCSPRModal";

// Casper SDK
import {
  AccessRights,
  CasperServiceByJsonRPC,
  CLByteArray,
  CLKey,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import { LIQUIDITYTRANSFORMER_CONTRACT_HASH, LIQUIDITYTRANSFORMER_PACKAGE_HASH, WISE_CONTRACT_HASH } from "../../../components/blockchain/AccountHashes/Addresses";
import { convertToStr } from "../../../components/ConvertToString/ConvertToString";
import { makeDeploy } from "../../../components/blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../../../components/blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../../../components/blockchain/PutDeploy/PutDeploy";
import { getDeploy } from "../../../components/blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import { createRecipientAddress } from '../../../components/blockchain/RecipientAddress/RecipientAddress';
import { useSnackbar } from "notistack";
import Torus from "@toruslabs/casper-embed";
import { useCookies } from "react-cookie";
import { Avatar, CardHeader } from "@material-ui/core";
import GlobalDataHeader from "../../../components/Headers/GlobalDataHeader";
import Axios from "axios";
import ReservationCard from "../../../components/Cards/ReservationCard";
import ReserveWiseModal from "../../../components/Modals/ReserveWiseModal";
import SigningModal from "../../../components/Modals/SigningModal";

// Content
const handleStakingWISEModal = createContext();
const handleStakingCSPRModal = createContext();

// Component Function
function Reservation() {
  // States
  const [openStakingWISEModal, setOpenStakingWISEModal] = useState(false);
  const [openStakingCSPRModal, setOpenStakingCSPRModal] = useState(false);
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


  console.log("cookies", cookies);

  // Handlers

  const [openReservationModal, setOpenReservationModal] = useState(false);
  const handleCloseReservationModal = () => {
    setOpenReservationModal(false);
  };
  const handleShowReservationModal = () => {
    setOpenReservationModal(true);
  };
  let [torus, setTorus] = useState();

  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  const [globalData, setGlobalData] = useState({});
  useEffect(() => {
    Axios
      .get("/getGlobalData")
      .then((res) => {
        setGlobalData(res.data.globalData[0]);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }, []);

  useEffect(() => {
    Axios
      .get("/globalReservationDaysData")
      .then((res) => {
        console.log("globalReservationDaysData", res);
        console.log("globalReservationDaysData", res.data.globalReservationDaysData);
        setGlobalReservationDaysData(res.data.globalReservationDaysData);
        // globalReservationDaysData
        // setGlobalData(res.data.globalData[0]);
      })
      .catch((error) => {
        setGlobalReservationDaysData([]);
        console.log(error);
        console.log(error.response);
      });
  }, []);

  function findIndexOfDay(day) {
    // console.log("day", day);
    // console.log("globalReservationDaysData", globalReservationDaysData);
    const index = globalReservationDaysData?.map(object => Number(object.currentWiseDay)).indexOf(day);
    // console.log("index", index);
    return index;
  }
  const { enqueueSnackbar } = useSnackbar();

  async function reserveWiseMakeDeploy(
    reservationAmount,
  ) {
    handleShowSigning();
    console.log("reservationAmount", reservationAmount);
    const publicKeyHex = activePublicKey;
    if (reservationAmount <= 0.5) {
      let variant = "Error";
      enqueueSnackbar("Minimum Reservation amount should be greater than 0.5 Caspers.", { variant });
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
        let deploy = await makeDeployWasm(
          publicKey,
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
          }
          handleCloseSigning();
          let variant = "success";
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

  return (
    <div>
      {/* Header */}
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setSelectedWallet={setSelectedWallet}
            setUserWiseBalance={setUserWiseBalance}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
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

        {/* <handleStakingWISEModal.Provider value={handleShowStakingWISEModal}>
          <handleStakingCSPRModal.Provider value={handleShowStakingCSPRModal}>
            <WiseStakingTabs />
          </handleStakingCSPRModal.Provider>
        </handleStakingWISEModal.Provider> */}
      </div>
      <div className="row">
        <div className="col-md-12 col-lg-12">
          {globalReservationDaysData !== null && globalReservationDaysData !== undefined ? (
            <Grid
              container
              spacing={3}
              direction="row"
              justifyContent="flex-start"
            // alignItems="flex-start"
            >
              {
                [...Array(50)].map((e, i) => {
                  return <ReservationCard key={i} day={i + 1} handleShowReservationModal={handleShowReservationModal} setSelectedDate={setSelectedDate} setSelectedDay={setSelectedDay} findIndexOfDay={findIndexOfDay} globalReservationDaysData={globalReservationDaysData} />
                })
              }

            </Grid>
          ) : (null)}
        </div>
      </div>

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
      />
      <SigningModal show={openSigning} />
    </div >
  );
}

export default Reservation;
export { handleStakingWISEModal, handleStakingCSPRModal };
