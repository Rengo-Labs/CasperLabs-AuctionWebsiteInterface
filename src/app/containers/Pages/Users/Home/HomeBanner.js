import React from "react";
import { useHistory } from "react-router-dom";
import HomeCards from "../../../../components/Cards/HomeCards";
function HomeBanner() {
  let history = useHistory();

  return (
    <section className="section section-search">
      <div className="container-fluid">
        <div className="banner-wrapper" style={{ paddingTop: "110px" }}>
          <div className="banner-header text-center">
            <h1 style={{ color: "white" }}>Welcome, Visitor!</h1>
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
              id="referals"
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
    </section>
  );
}

export default HomeBanner;
