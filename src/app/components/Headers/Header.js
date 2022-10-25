import Torus from "@toruslabs/casper-embed";
import axios from "axios";
import { CLPublicKey, Signer } from "casper-js-sdk";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Logo from "../../assets/img/Logo.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { AppContext } from "../../containers/App/Application";
import { WISE_CONTRACT_HASH } from "../blockchain/AccountHashes/Addresses";
import WalletModal from "../Modals/WalletModal";

export const CHAINS = {
  CASPER_MAINNET: "casper",
  CASPER_TESTNET: "casper-test",
};

export const SUPPORTED_NETWORKS = {
  [CHAINS.CASPER_MAINNET]: {
    blockExplorerUrl: "https://cspr.live",
    chainId: "0x1",
    displayName: "Casper Mainnet",
    logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_MAINNET,
  },
  [CHAINS.CASPER_TESTNET]: {
    blockExplorerUrl: "https://testnet.cspr.live",
    chainId: "0x2",
    displayName: "Casper Testnet",
    logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://testnet.casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_TESTNET,
  },
};

let torus = null;
// console.log("torus", torus);

function HeaderHome(props) {
  const { enqueueSnackbar } = useSnackbar();
  let [menuOpenedClass, setMenuOpenedClass] = useState();
  let [signerLocked, setSignerLocked] = useState();
  let [signerConnected, setSignerConnected] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [, setAccount] = useState("");
  const { activePublicKey, setActivePublicKey } = useContext(AppContext);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const handleCloseWalletModal = () => {
    setOpenWalletModal(false);
  };
  const handleShowWalletModal = () => {
    setOpenWalletModal(true);
  };
  useEffect(() => {
    // console.log(
    //   "localStorage.getItem(selectedWallet)",
    //   localStorage.getItem("selectedWallet")
    // );
    if (
      props.selectedWallet === "Casper" ||
      localStorage.getItem("selectedWallet") === "Casper"
    ) {
      setTimeout(async () => {
        try {
          const connected = await checkConnection();
          setSignerConnected(connected);
        } catch (err) {
          console.log(err);
        }
      }, 100);
      if (signerConnected) {
        console.log("signer is connected!");
        handleCloseWalletModal();
        let res = getActiveKeyFromSigner();
        console.log("address res: ", res);
        localStorage.setItem("Address", res);
        setActivePublicKey(res);
      }
      window.addEventListener("signer:connected", (msg) => {
        handleCloseWalletModal();
        console.log("the message is: ", msg);
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(true);
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
        console.log("publick key in header to find: ", msg.detail.activeKey);
      });
      window.addEventListener("signer:disconnected", (msg) => {
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(false);
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:tabUpdated", (msg) => {
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(msg.detail.isConnected);
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:activeKeyChanged", (msg) => {
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:locked", (msg) => {
        setSignerLocked(!msg.detail.isUnlocked);
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:unlocked", (msg) => {
        handleCloseWalletModal();
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(msg.detail.isConnected);
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:initialState", (msg) => {
        // console.log("Initial State: ", msg.detail);
        handleCloseWalletModal();
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(msg.detail.isConnected);
        localStorage.setItem("Address", msg.detail.activeKey);
        setActivePublicKey(msg.detail.activeKey);
      });
    }
    console.log("selected wallet from props: ", props.selectedWallet);
    // eslint-disable-next-line
  }, [props.selectedWallet]);
  useEffect(() => {
    // console.log(
    //   "localStorage.getItem(selectedWallet)",
    //   localStorage.getItem("selectedWallet")
    // );
    if (
      activePublicKey && activePublicKey != null && activePublicKey != undefined && activePublicKey != 'null'
    ) {
      console.log("HELLO", activePublicKey);
      axios
        .get(`/wiseBalanceAgainstUser/${WISE_CONTRACT_HASH}/${Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")}`)
        .then((res) => {
          console.log("res", res);
          props.setUserWiseBalance(Number(res.data.balance / 10 ** 9))
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
        });
    }
    // eslint-disable-next-line
  }, [activePublicKey])

  const login = async () => {
    try {
      setIsLoading(true);
      torus = new Torus();
      // console.log("torus", torus);
      await torus.init({
        buildEnv: "testing",
        showTorusButton: true,
        network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
      });
      const loginaccs = await torus?.login();
      props.setTorus(torus);
      localStorage.setItem("torus", JSON.stringify(torus));
      localStorage.setItem("Address", (loginaccs || [])[0]);
      setActivePublicKey((loginaccs || [])[0]);
      setAccount((loginaccs || [])[0] || "");
      handleCloseWalletModal();
    } catch (error) {
      console.error(error);
      await torus?.clearInit();
      let variant = "Error";
      enqueueSnackbar("Unable to Login", { variant });
    } finally {
      setIsLoading(false);
    }
  };
  // const changeProvider = async () => {
  //   const providerRes = await torus?.setProvider(SUPPORTED_NETWORKS[CHAINS.CASPER_MAINNET]);
  //   console.log("provider res", providerRes);
  // };

  // const getLatestBlock = async () => {
  //   const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //   const latestBlock = await casperService.getLatestBlockInfo();
  //   console.log("latest block", latestBlock);
  // };

  // const getUserInfo = async () => {
  //   const userInfo = await torus?.getUserInfo();
  //   console.log("userInfo", userInfo);
  // };

  const logout = async () => {
    try {
      // console.log("logout", torus);
      await torus?.logout();
      setAccount("");
      props.setTorus("");
      props.setSelectedWallet();
      localStorage.removeItem("Address");
      localStorage.removeItem("selectedWallet");
      window.location.reload();
    } catch (error) {
      // console.log("logout error", error);
      let variant = "Error";
      enqueueSnackbar("Unable to Logout", { variant });
    }
  };
  async function checkConnection() {
    try {
      return await Signer.isConnected();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to connect", { variant });
    }
  }

  async function getActiveKeyFromSigner() {
    try {
      return await Signer.getActivePublicKey();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to get Active Public Key", { variant });
    }
  }
  async function connectToSigner() {
    try {
      setIsLoading(true);
      return await Signer.sendConnectionRequest();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to send Connection Request", { variant });
    } finally {
      setIsLoading(false);
    }
  }

  const selectedStyling = {
    border: "2px solid '#ea3429'",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#FFF",
    backgroundColor: "#ea3429",
  };
  const defaultStyling = {
    padding: "10px 20px",
    borderRadius: "5px",
  };
  const selectedNavStyle = {
    Home: props.selectedNav === "Home" ? selectedStyling : defaultStyling,
    Staking: props.selectedNav === "Staking" ? selectedStyling : defaultStyling,
    Refer: props.selectedNav === "Refer" ? selectedStyling : defaultStyling,
    Reservation: props.selectedNav === "Reservation" ? selectedStyling : defaultStyling,
  };

  let Disconnect = (e) => {
    // console.log("Disconnect");
    Cookies.remove("Authorization");
    localStorage.removeItem("Address");
    localStorage.removeItem("selectedWallet");
    setActivePublicKey("");
    props.setSelectedWallet();
    try {
      Signer.disconnectFromSite();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to Disconnect", { variant });
    }

    window.location.reload();
  };

  return (
    <header className={`header ${menuOpenedClass}`}>
      <nav
        className="navbar navbar-expand-lg header-nav"
        style={{ width: "100%" }}
      >
        <span className="navbar-header">
          <a
            id="mobile_btn"
            href="/"
            style={{ color: "#ea3429" }}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpenedClass("menu-opened");
            }}
          >
            <span className="bar-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>

          <Link
            style={{ color: "#ea3429" }}
            to="/"
            className="navbar-brand logo"
          >
            <img
              src={Logo}
              style={{ borderRadius: "50px" }}
              alt="Logo"
              width="50"
            />
          </Link>
        </span>

        <span className="main-menu-wrapper">
          <span className="menu-header">
            <a
              id="menu_close"
              className="menu-close"
              style={{ color: "#ea3429" }}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpenedClass("");
              }}
            >
              <i className="fas fa-times"></i> Close
            </a>
          </span>
          <ul
            className="main-nav "
            style={{
              marginTop: "4px",
            }}
          >
            {isLoading ? (
              <span className="text-center">
                {/* <Spinner
                  animation="border"
                  role="status"
                  style={{ color: "e84646" }}
                >
                  <span className="sr-only">Loading...</span>
                </Spinner> */}
              </span>
            ) : localStorage.getItem("Address") &&
              localStorage.getItem("Address") !== null &&
              localStorage.getItem("Address") !== "null" ? (
              <li className="login-link ">
                <a
                  href={
                    "https://testnet.cspr.live/account/" +
                    localStorage.getItem("Address")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#ea3429" }}
                >
                  <span style={{ cursor: "pointer" }}>
                    {localStorage.getItem("Address").slice(0, 10)}. . .
                  </span>
                </a>
              </li>
            ) : signerLocked && signerConnected ? (
              <li
                onClick={() => {
                  handleShowWalletModal();
                  // async () => {
                  // await connectToSigner();
                }}
                className="login-link "
              >
                <a
                  href="#"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#ea3429" }}
                >
                  Connect to Wallet
                </a>
              </li>
            ) : (
              <li
                onClick={() => {
                  handleShowWalletModal();
                  // async () => {
                  // await connectToSigner()
                }}
                className="login-link "
              >
                <a
                  href="#"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#ea3429" }}
                >
                  Connect to Wallet
                </a>
              </li>
            )}

            <li
              onClick={() => {
                if (
                  localStorage.getItem("selectedWallet") &&
                  localStorage.getItem("selectedWallet") !== null &&
                  localStorage.getItem("selectedWallet") !== "null" &&
                  localStorage.getItem("selectedWallet") === "Torus"
                ) {
                  logout();
                } else {
                  Disconnect();
                }
              }}
              className="login-link "
            >
              {localStorage.getItem("Address") &&
                localStorage.getItem("Address") !== null &&
                localStorage.getItem("Address") !== "null" ? (
                <a
                  href="#"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#ea3429" }}
                >
                  <span style={{ cursor: "pointer" }}>Disconnect</span>
                </a>
              ) : null}
            </li>
            <li>
              <Link
                to="/"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#ea3429" }}
              >
                <span style={selectedNavStyle.Home}>Home</span>
              </Link>
            </li>
            <li>
              <a
                href={"https://wise-swap.herokuapp.com/swap"}
                target={"_blank"}
                rel={"noreferrer noopener"}
                className=" align-items-center justify-content-center text-center"
                to="/swap"
                style={{ color: "#ea3429" }}
              >
                <span style={selectedNavStyle.Swap}>Swap</span>
              </a>
            </li>
            {/* Men at Work */}

            <li>
              <Link
                className=" align-items-center justify-content-center text-center"
                to="/staking"
                style={{ color: "#ea3429" }}
              >
                <span style={selectedNavStyle.Staking}>Wise Staking</span>
              </Link>
            </li>

            <li>
              <Link
                className=" align-items-center justify-content-center text-center"
                to="/refer"
                style={{ color: "#ea3429" }}
              >
                <span style={selectedNavStyle.Refer}>Referral System</span>
              </Link>
            </li>
            <li>
              <Link
                className=" align-items-center justify-content-center text-center"
                to="/reservation"
                style={{ color: "#ea3429" }}
              >
                <span style={selectedNavStyle.Reservation}>Wise Reservation</span>
              </Link>
            </li>
          </ul>
        </span>
        <ul className="nav header-navbar-rht">
          <li>
            {isLoading ? (
              <span className="text-center">
                <Spinner
                  animation="border"
                  role="status"
                  style={{ color: "e84646" }}
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </span>
            ) : localStorage.getItem("Address") &&
              localStorage.getItem("Address") !== null &&
              localStorage.getItem("Address") !== "null" ? (
              <a
                href={
                  "https://testnet.cspr.live/account/" +
                  localStorage.getItem("Address")
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ea3429" }}
              >
                <span style={{ cursor: "pointer" }}>
                  {localStorage.getItem("Address").substr(0, 10)}. . .
                </span>
              </a>
            ) : signerLocked && signerConnected ? (
              <>
                <Button
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#ea3429",
                    borderColor: "#ea3429",
                  }}
                  variant="primary"
                  className="fade-in-text"
                  onClick={
                    () => {
                      handleShowWalletModal();
                    }
                  }
                >
                  Connect to Wallet
                </Button>
              </>
            ) : (
              <>
                <Button
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#ea3429",
                    borderColor: "#ea3429",
                  }}
                  variant="primary"
                  className="fade-in-text"
                  onClick={() => {
                    handleShowWalletModal();
                  }}
                >
                  Connect to Wallet
                </Button>
              </>
            )}
          </li>
          <li>
            {localStorage.getItem("Address") &&
              localStorage.getItem("Address") !== null &&
              localStorage.getItem("Address") !== "null" ? (
              <span
                style={{ cursor: "pointer", color: "#ea3429" }}
                onClick={() => {
                  if (
                    localStorage.getItem("selectedWallet") &&
                    localStorage.getItem("selectedWallet") !== null &&
                    localStorage.getItem("selectedWallet") !== "null" &&
                    localStorage.getItem("selectedWallet") === "Torus"
                  ) {
                    logout();
                  } else {
                    Disconnect();
                  }
                }}
              >
                Disconnect
              </span>
            ) : null}
          </li>
        </ul>
      </nav>
      <WalletModal
        show={openWalletModal}
        handleClose={handleCloseWalletModal}
        torusLogin={login}
        casperLogin={connectToSigner}
        setSelectedWallet={props.setSelectedWallet}
      />
    </header>
  );
}

export default HeaderHome;
