// React
import React from "react";

// Bootstrap
import "../../assets/css/bootstrap.min.css";

// Material UI Icons
import LanIcon from "@mui/icons-material/Lan";

// Material UI

// Custom Styling
import "../../assets/css/wiseTableDefault.css";

// Components
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";

// Content
const WiseTableDefault = (props) => {
  return (
    <>
      <div className=" wiseTableDefaultWrapper">
        <div className="row no-gutters justify-content-center align-items-center">
          <div className="icon-wrapper ">
            <LanIcon sx={{ color: "rgb(234, 52, 41)", fontSize: "44px" }} />
          </div>
        </div>
        <div className="row no-gutters justify-content-center align-items-center">
          <section className="wiseTableDefaultPropStyles">
            <h2>{props.message}</h2>
            <p className="text-center">{props.advice}</p>
          </section>
        </div>
        <div className="row no-gutters justify-content-center align-items-center">
          <WiseStakingTableButtons  handleShowStakingWiseModal={props.handleShowStakingWiseModal} btnContent={"Create Regular Stake (WISE)"} />
          <WiseStakingTableButtons btnContent={"Create Regular Stake (ETH)"} handleShowStakingWiseModal={props.handleShowStakingWiseModal} />
        </div>
      </div>
    </>
  );
};

export default WiseTableDefault;
