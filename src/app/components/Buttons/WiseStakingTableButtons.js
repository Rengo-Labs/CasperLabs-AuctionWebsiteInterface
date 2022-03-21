// React
import React from "react";

// Bootstrap
import "../../assets/css/bootstrap.min.css";

// Custom CSS
import "../../assets/css/WiseStakingTableButtons.css";

// Content
const WiseStakingTableButtons = (props) => {
  return (
    <div>
      <button className="mr-3 tableBtn">{props.btnContent}</button>
    </div>
  );
};

export default WiseStakingTableButtons;
