// React
import React from "react";

// Bootstrap
import "../../assets/css/bootstrap.min.css";

// Custom CSS
import "../../assets/css/WiseStakingTableButtons.css";

// Content
const WiseStakingTableButtons = ({handleShowStakingWiseModal}) => {
  return (
    <div>
      <div className="buttonsWrapper">
        {/* <h1>This is Table Buttons Page.</h1> */}
        <button onClick={handleShowStakingWiseModal}>Create Wise Stake</button>
      </div>
    </div>
  );
};

export default WiseStakingTableButtons;
