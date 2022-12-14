import React, { useEffect, useState } from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

function HomeScreen() {
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [userWiseBalance, setUserWiseBalance] = useState(0);
  const { refree } = useParams();
  const [cookies, setCookie] = useCookies(["refree"]);
  console.log("refree", refree);
  useEffect(() => {
    const controller=new AbortController()
    
    if (
      refree && refree !== null && refree != undefined && refree.length === 66
    ) {
      setCookie("refree", refree, {
        path: "/"
      });
    }
    return () => {
      controller.abort()
    }
  }, [refree]);
  console.log("from home");
  console.log(localStorage.getItem("Address"));
  let [torus, setTorus] = useState();
  return (
    <div className="main-wrapper">
      <div className="home-section home-full-height">
        <HeaderHome
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setUserWiseBalance={setUserWiseBalance}
          setTorus={setTorus}
          selectedNav={"Home"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
      </div>

      <Footer position={"relative"} />
    </div>
  );
}

export default HomeScreen;
