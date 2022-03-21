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
      <div>
        <button className="mr-3">{props.btnContent}</button>
      </div>
    </div>
  );
};

export default WiseStakingTableButtons;
