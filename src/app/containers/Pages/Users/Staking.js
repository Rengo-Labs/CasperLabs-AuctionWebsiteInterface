// React
import React from "react";
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
import { useSnackbar } from "notistack";
import Torus from "@toruslabs/casper-embed";

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

  const { enqueueSnackbar } = useSnackbar();

  async function createStakeMakeDeploy(
    stakingAmount,
    stakingDuration,
    referrerAddress,
    isCspr,
    mainPurse
  ) {
    handleShowSigning();
    console.log("contractHash");
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      console.log("checking staking active Key: ", activePublicKey);
      const pubicKey = new CLByteArray(
        Uint8Array.from(Buffer.from(activePublicKey, "hex"))
      );
      // try {
      const runtimeArgs = isCspr
        ? RuntimeArgs.fromMap({
            amount: CLValueBuilder.u256(convertToStr(stakingAmount)),
            lock_days: CLValueBuilder.u64(stakingDuration),
            referrer: new CLKey(pubicKey),
            purse: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
          })
        : RuntimeArgs.fromMap({
            staked_amount: CLValueBuilder.u256(convertToStr(stakingAmount)),
            lock_days: CLValueBuilder.u64(stakingDuration),
            referrer: new CLKey(pubicKey),
          });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(WISE_CONTRACT_HASH, "hex")
      );
      let entryPoint = !isCspr
        ? "create_stake_Jsclient"
        : "create_stake_with_cspr_Jsclient";

      // Set contract installation deploy (unsigned).
      let deploy = await makeDeploy(
        publicKey,
        contractHashAsByteArray,
        entryPoint,
        runtimeArgs,
        paymentAmount
      );
      console.log("make deploy: ", deploy);
      // try {
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
      enqueueSnackbar("Approved Successfully", { variant });
      //   }
      //  catch {
      //     handleCloseSigning();
      //     let variant = "Error";
      //     enqueueSnackbar("Unable to Approve", { variant });
      //   }
      // } catch {
      //   handleCloseSigning();
      //   let variant = "Error";
      //   enqueueSnackbar("Input values are too large", { variant });
      // }
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
            selectedWallet={selectedWallet}
            setTorus={setTorus}
            selectedNav={"Staking"}
          />
          <div
            className="content"
            style={{ paddingTop: "100px" }}
            position="absolute"
          ></div>
        </div>
      </div>
      {/* /Header */}
      {/* Body */}
      <div className="container-fluid mx-auto">
        <div className="row no-gutters">
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
        handleClose={handleCloseStakingWISEModal}
        createStakeMakeDeploy={createStakeMakeDeploy}
      />
      <StakingCSPRModal
        show={openStakingCSPRModal}
        handleClose={handleCloseStakingCSPRModal}
        createStakeMakeDeploy={createStakeMakeDeploy}
      />
    </div>
  );
}

export default Staking;
export { handleStakingWISEModal, handleStakingCSPRModal };
