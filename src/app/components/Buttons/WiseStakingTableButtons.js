// React
import React, { useContext } from "react";
// Bootstrap
import "../../assets/css/bootstrap.min.css";
// Custom CSS
import "../../assets/css/stakingTableButtons.css";
// Components
import {
  handleStakingWISEModal,
  handleStakingCSPRModal,
} from "../../containers/Pages/Users/Staking";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../../containers/App/Application";

// Component Function
const WiseStakingTableButtons = (props) => {
  const { activePublicKey } = useContext(AppContext);
  const wiseModal = useContext(handleStakingWISEModal);
  const csprModal = useContext(handleStakingCSPRModal);

  const connectWallet = () => {
    toast.error("Please connect your wallet first", {
      style: {
        padding: "16px",
        border: "1px solid rgb(234, 52, 41)",
        color: "#777",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#a60011",
      },
      id: "connectWalletToast",
    });
  };

  return (
    <div>
      <button
        className="mr-3 tableBtn"
        onClick={
          activePublicKey === null || activePublicKey === "null"
            ? connectWallet
            : props.cspr
            ? csprModal
            : wiseModal
        }
      >
        {props.btnContent}
      </button>
      <Toaster />
    </div>
  );
};

export default WiseStakingTableButtons;
