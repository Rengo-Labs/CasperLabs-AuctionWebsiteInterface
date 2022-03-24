import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import HomeCards from "../../../../components/Cards/HomeCards";


// Material UI Icons
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function HomeBanner() {
  let history = useHistory();
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );

  return (
    <section className="section section-search">
      <div className="container-fluid">
        <div className="banner-wrapper" style={{ paddingTop: "100px" }}>
          <div className="banner-header text-center">
            <h1 style={{ color: "white" }}>Welcome, {activePublicKey ? (activePublicKey.slice(0, 10) + "...") : ("Visitor")}</h1>
            <p style={{ color: "white" }}>
              WISE is an asset-backed cryptocurrency designed to be a highly
              secure store of value. Additionally, WISE staking allows you to
              earn more tokens daily. Longer stakes have greater earning
              potential. You can also earn WISE by promoting the project through
              the WISE referral program.
            </p>
          </div>
        </div>
        <div className="row no-gutters mt-5 justify-content-between">
          <div className="col-12 col-md-3">
            <div
              onClick={() => history.push("/staking")}
              style={{ cursor: "pointer" }}
            >
              <HomeCards title={"YOUR STAKES"} />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              onClick={() => history.push("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <HomeCards title={"YOUR REFEREALS"} />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div style={{ cursor: "pointer" }}>
              <HomeCards title={"YOUR PORTFOLIO"} />
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row no-gutters mt-5 justify-content-between">
          <div className="col-12 col-md-3">
            <div
              onClick={() => history.push("/staking")}
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h2>128,341,593 WISE</h2>
                  <div className="row no-gutters justify-content-between align-items-center w-100">
                    <div className="divider"></div>
                    <ChevronRightIcon fontSize="large" />
                  </div>
                  <div className="titleWrapper">
                    <div className="row no-gutters align-items-center">
                      <h6
                        className="m-0 mr-2"
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        GLOBAL WISE STAKED
                      </h6>
                      <HelpOutlineIcon
                        className="helpOutlineIcon"
                        sx={{ fontSize: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              onClick={() => history.push("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h2>1,522,927,719 SHRS</h2>
                  <div className="row no-gutters justify-content-between align-items-center w-100">
                    <div className="divider"></div>
                    <ChevronRightIcon fontSize="large" />
                  </div>
                  <div className="titleWrapper">
                    <div className="row no-gutters align-items-center">
                      <h6
                        className="m-0 mr-2"
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        GLOBAL WISE SHARES
                      </h6>
                      <HelpOutlineIcon
                        className="helpOutlineIcon"
                        sx={{ fontSize: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              onClick={() => history.push("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h2>1,289,979,815 rSHRS</h2>
                  <div className="row no-gutters justify-content-between align-items-center w-100">
                    <div className="divider"></div>
                    <ChevronRightIcon fontSize="large" />
                  </div>
                  <div className="titleWrapper">
                    <div className="row no-gutters align-items-center">
                      <h6
                        className="m-0 mr-2"
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        GLOBAL REFERRAL SHARES
                      </h6>
                      <HelpOutlineIcon
                        className="helpOutlineIcon"
                        sx={{ fontSize: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              onClick={() => history.push("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h2>0.145498 WISE</h2>
                  <div className="row no-gutters justify-content-between align-items-center w-100">
                    <div className="divider"></div>
                    <ChevronRightIcon fontSize="large" />
                  </div>
                  <div className="titleWrapper">
                    <div className="row no-gutters align-items-center">
                      <h6
                        className="m-0 mr-2"
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        GLOBAL SHARE PRICE
                      </h6>
                      <HelpOutlineIcon
                        className="helpOutlineIcon"
                        sx={{ fontSize: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
