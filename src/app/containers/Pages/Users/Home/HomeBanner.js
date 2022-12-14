import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeCards from "../../../../components/Cards/HomeCards";
import { AppContext } from "../../../App/Application";
// Material UI Icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { CLPublicKey } from "casper-js-sdk";
import { WISE_CONTRACT_HASH } from "../../../../components/blockchain/AccountHashes/Addresses";
import { balanceOf } from "../../../../components/JsClients/WISETOKEN/wiseTokenFunctionsForBackend/functions";

function HomeBanner() {
  const { activePublicKey } = useContext(AppContext);
  let navigate = useNavigate();

  const [globalData, setGlobalData] = useState({});
  const [wiseBalanceAgainstUser, setwiseBalanceAgainstUser] = useState(0);

  useEffect(() => {
    const controller = new AbortController()

    if (
      activePublicKey &&
      activePublicKey !== null &&
      activePublicKey !== "null" &&
      activePublicKey !== undefined
    ) {
      async function fetchData() {
        let balance = await balanceOf(WISE_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        setwiseBalanceAgainstUser(balance / 10 ** 9);
      }
      fetchData();

    }
    return () => {
      controller.abort()
    }
  }, [activePublicKey]);

  useEffect(() => {
    const controller = new AbortController()
    axios
      .get("/getGlobalData")
      .then((res) => {
        setGlobalData(res.data.globalData[0]);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
    return () => {
      controller.abort()
    }
  }, []);

  return (
    <section className="section section-search">
      <div className="container-fluid">
        <div className="banner-wrapper" style={{ paddingTop: "100px" }}>
          <div className="banner-header text-center">
            <h1 style={{ color: "white" }}>
              Welcome,{" "}
              {activePublicKey
                ? activePublicKey.slice(0, 10) + "..."
                : "Visitor"}
            </h1>
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
              onClick={() => navigate("/staking")}
              style={{ cursor: "pointer" }}
            >
              <HomeCards stake={globalData.stakeCount ? globalData.stakeCount : 0} title={"YOUR STAKES"} />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              onClick={() => navigate("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <HomeCards
                stake={globalData.reservationReferrerCount ? globalData.reservationReferrerCount : 0}
                title={"YOUR REFERRALS"}
              />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div style={{ cursor: "pointer" }}>
              <HomeCards
                stake={wiseBalanceAgainstUser}
                title={"YOUR PORTFOLIO"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row mt-5 justify-content-between">
          <div className="col-12 col-md-3">
            <div
              onClick={() => navigate("/staking")}
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h3>{globalData.totalStaked ? globalData.totalStaked / 10 ** 9 : 0} WISE</h3>
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
              onClick={() => navigate("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h3>{globalData.totalShares ? globalData.totalShares / 10 ** 9 : 0} SHRS</h3>
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
              onClick={() => navigate("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h3>{globalData.referrerShares ? globalData.referrerShares / 10 ** 9 : 0} rSHRS</h3>
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
              onClick={() => navigate("/refer")}
              id="referrals"
              style={{ cursor: "pointer" }}
            >
              <div className="card cardSkeleton border-secondary">
                <div className="card-body pb-0">
                  <h3>{globalData.sharePrice ? globalData.sharePrice / 10 ** 9 : 0} WISE</h3>
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
