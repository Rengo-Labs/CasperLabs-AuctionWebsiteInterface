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

// Content

// Component Function
const WiseStakingTableButtons = (props) => {
  const wiseModal = useContext(handleStakingWISEModal);
  const csprModal = useContext(handleStakingCSPRModal);
  return (
    <div>
      <button
        className="mr-3 tableBtn"
        onClick={props.cspr === true ? csprModal : wiseModal}
      >
        {props.btnContent}
      </button>
    </div>
  );
};

export default WiseStakingTableButtons;
