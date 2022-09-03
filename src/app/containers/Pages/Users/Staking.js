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
  CLByteArray,
  CLKey,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import { WISE_CONTRACT_HASH } from "../../../components/blockchain/AccountHashes/Addresses";
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

// Content
const handleStakingWISEModal = createContext();
const handleStakingCSPRModal = createContext();

// Component Function
function Staking() {
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
  const [userCsprBalance, setUserCsprBalance] = useState(0);
  
  console.log("cookies", cookies);
  // Handlers
  const handleCloseStakingWISEModal = () => {
    setOpenStakingWISEModal(false);
  };
  const handleShowStakingWISEModal = () => {
    setOpenStakingWISEModal(true);
  };

  const handleCloseStakingCSPRModal = () => {
    setOpenStakingCSPRModal(false);
  };
  const handleShowStakingCSPRModal = () => {
    setOpenStakingCSPRModal(true);
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
      const paymentAmount = 5000000000;
      console.log("checking staking active Key: ", activePublicKey);
      const accountHash = Buffer.from(CLPublicKey.fromHex(referrerAddress).toAccountHash()).toString("hex");
      const referrerAddressByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(accountHash, "hex"))
      );
      try {
        const runtimeArgs = isCspr
          ? (RuntimeArgs.fromMap({
            amount: CLValueBuilder.u256(convertToStr(stakingAmount)),
            lock_days: CLValueBuilder.u64(stakingDuration),
            referrer: createRecipientAddress(referrerAddressByteArray),
            purse: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
          }))
          : (RuntimeArgs.fromMap({
            staked_amount: CLValueBuilder.u256(stakingAmount),
            lock_days: CLValueBuilder.u64(stakingDuration),
            referrer: createRecipientAddress(referrerAddressByteArray),
          }));
        console.log("runtimeArgs", runtimeArgs);
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(WISE_CONTRACT_HASH, "hex")
        );
        let entryPoint = !isCspr
          ? "create_stake_Jsclient"
          : "create_stake_with_cspr_Jsclient";

        //   // Set contract installation deploy (unsigned).
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
                {localStorage.getItem("Address") ? (
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
            <WiseStakingTabs />
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
    </div>
  );
}

export default Staking;
export { handleStakingWISEModal, handleStakingCSPRModal };
