// React
import React from "react";
import { useState } from "react";

// Components
import HeaderHome from "../../../components/Headers/Header";
import WiseStakingTabs from "../../../components/Tabs/WiseStakingTabs";

// Material UI
import AccessAlarmTwoToneIcon from "@mui/icons-material/AccessAlarmTwoTone";

// Bootstrap
import "../../../assets/css/bootstrap.min.css";

// Custom Styling
import "../../../assets/css/stakingStyles.css";

// Content
function Staking() {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  return (
    <div>
      {/* Header */}
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setActivePublicKey={setActivePublicKey}
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
        <WiseStakingTabs />
      </div>
      <footer style={{ height: "3rem", width: "100%" }}></footer>
    </div>
  );
}

export default Staking;
