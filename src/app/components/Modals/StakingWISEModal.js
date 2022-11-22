import AccessAlarmTwoToneIcon from "@mui/icons-material/AccessAlarmTwoTone";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../containers/App/Application";
import { WISE_CONTRACT_HASH } from "../blockchain/AccountHashes/Addresses";
import { useCookies } from "react-cookie";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { balanceOf } from "../JsClients/WISETOKEN/wiseTokenFunctionsForBackend/functions";

// -------------------- COMPONENT FUNCTION --------------------
function StakingWISEModal(props) {
  console.log("propsprops", props);
  const { activePublicKey } = useContext(AppContext);
  const [balance, setBalance] = useState("");
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [wiseBalanceAgainstUser, setwiseBalanceAgainstUser] = useState(props.userWiseBalance);
  const [durationBonus, setDurationBonus] = useState(0);
  // const [duration, setDuration] = useState(0);
  const [percentagedBalance, setPercentagedBalance] = useState();
  const [year, setYear] = useState("");
  const [days, setDays] = useState("");
  const [daysOpen, setDaysOpen] = useState(false);
  const [addy, setAddy] = useState("");
  const [addyOpen, setAddyOpen] = useState(false);
  const [referrer, setReferrer] = useState();
  const [referrerAddress, setReferrerAddress] = useState();
  const [referrerCheck, setReferrerCheck] = useState(false);
  const [daysCheck, setDaysCheck] = useState(false);
  const [amountCheck, setAmountCheck] = useState(false);
  const [renderButtonInactive, setRenderButtonInactive] = useState(true);
  console.log("percentagedBalance", percentagedBalance);
  const [cookies, setCookie] = useCookies(["refree"]);
  // -------------------- Life Cycle Methods--------------------
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

  // useEffect(() => {
  // const controller=new AbortController()
  //   let cancel = false;
  //   let publicKeyHex = activePublicKey
  //   // if (
  //   //   publicKeyHex !== null &&
  //   //   publicKeyHex !== "null" &&
  //   //   publicKeyHex !== undefined
  //   // ) {
  //     axios
  //       .get(`/getStakeData/${Buffer.from(CLPublicKey.fromHex(referrerAddress).toAccountHash()).toString("hex")}`)

  //       .then((res) => {
  //         if (cancel) return;
  //         setReferrer(res.data.stakesData[0].referrer);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         console.log(error.response);
  //       });
  //   // }
  //   return () => {
  //     cancel = true;
  //   };
  // return () => {
  //   controller.abort()
  // }
  // }, [activePublicKey]);

  useEffect(() => {
    const controller = new AbortController()
    if (amountCheck && daysCheck && referrerCheck) {
      setRenderButtonInactive(false);
    }
    return () => {
      controller.abort()
    }
  }, [amountCheck, daysCheck, referrerCheck]);

  // -------------------- Event Handlers --------------------

  const balanceOnChange = (event) => {
    console.log("wiseBalanceAgainstUser", wiseBalanceAgainstUser);
    console.log("wiseBalanceAgainstUser", percentagedBalance);
    if (percentagedBalance > wiseBalanceAgainstUser) {
      setPercentagedBalance(wiseBalanceAgainstUser);
      setBalance(100)
    }
    else {
      let value = event.target.value;
      let percent = (100 * value) / wiseBalanceAgainstUser;

      setPercentagedBalance(value);
      setAmountCheck(true);
      if (percent === 25) {
        setBalance(25);
      } else if (percent === 50) {
        setBalance(50);
      } else if (percent === 75) {
        setBalance(75);
      } else {
        console.log("empty");
        setBalance("");
      }
    }
  };

  const handleBalanceChange = (event) => {
    console.log("event.target.value", event.target.value);
    let value = event.target.value;
    setBalance(value);
    if (wiseBalanceAgainstUser !== null) {
      console.log("inside the change: ", isNaN(wiseBalanceAgainstUser));
      setPercentagedBalance((wiseBalanceAgainstUser * value) / 100);
      setAmountCheck(true);
    }
  };

  const handleBalanceClose = () => {
    setBalanceOpen(false);
  };

  const handleBalanceOpen = () => {
    setBalanceOpen(true);
  };

  const handleDaysChange = (event) => {
    setYear(event.target.value);
    setDays(event.target.value * 365);
    setDurationBonus((event.target.value) * 5)
    setDaysCheck(true);
  };

  const handleDaysClose = () => {
    setDaysOpen(false);
  };

  const handleDaysOpen = () => {
    setDaysOpen(true);
  };

  const handleAddyChange = (event) => {
    console.log("event.target.value", event.target.value);
    setAddy(event.target.value);
    if (event.target.value === "Cookie Reffral Addy") {
      setReferrerAddress(cookies.refree);
    } else {
      setReferrerAddress("010650ac3716ff39a0b66bec203fa3403911237c27cfb38fa43b3da39e909fc3b6");
    }

    setReferrerCheck(true);
  };

  const handleAddyClose = () => {
    setAddyOpen(false);
  };

  const handleAddyOpen = () => {
    setAddyOpen(true);
  };

  // -------------------- jsx --------------------

  return (
    <Modal size="xl" centered show={props.show} onHide={props.handleClose}>
      <Modal.Body
        style={{
          color: "#000027",
          fontWeight: "600",
        }}
      >
        <Card style={{ marginBottom: "10px", borderRadius: "8px" }}>
          <CardContent>
            <div className="container-fluid">
              <span
                onClick={props.handleClose}
                style={{ float: "right", cursor: "pointer" }}
              >
                <img src={Exit} alt="exit" width="15" />
              </span>
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  <div className="text-center filter-widget">
                    <Typography
                      variant="h5"
                      style={{ fontWeight: "600" }}
                      gutterBottom
                    >
                      Input Details
                    </Typography>
                    <Typography gutterBottom style={{ color: "#a6a6b9" }}>
                      Estimated SHRS for opening new Stake
                    </Typography>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-lg-8">
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Staking Amount
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          type="number"
                          value={percentagedBalance}
                          onChange={balanceOnChange}
                          placeholder="Staking Amount"
                          startAdornment={
                            <InputAdornment position="start">
                              <AccountBalanceWalletOutlinedIcon />
                            </InputAdornment>
                          }
                          label="Staking Amount"
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12 col-lg-4">
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel id="demo-controlled-open-select-label">
                          WISE
                        </InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={balanceOpen}
                          onClose={handleBalanceClose}
                          onOpen={handleBalanceOpen}
                          label="WISE"
                          onChange={handleBalanceChange}
                          value={balance}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={25}>25% Balance</MenuItem>
                          <MenuItem value={50}>50% Balance</MenuItem>
                          <MenuItem value={75}>75% Balance</MenuItem>
                          <MenuItem value={100}>Max Balance</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-lg-8">
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Staking Duration
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          value={days}
                          onChange={(e) => {
                            if (e.target.value < 15330) {
                              setDaysCheck(true);
                              setDays(e.target.value);
                              if (((e.target.value / 365) * 5).toFixed(2) < 30) {
                                setDurationBonus(((e.target.value / 365) * 5).toFixed(2))
                              }
                              else {
                                setDurationBonus(30.00)
                              }
                            } else {
                              setDays(15330)
                              setDurationBonus(30.00)
                            }
                            setYear("");
                          }}
                          placeholder="Staking Duration"
                          startAdornment={
                            <InputAdornment position="start">
                              <AlarmOnIcon />
                            </InputAdornment>
                          }
                          label="Staking Duration"
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12 col-lg-4">
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel id="demo-controlled-open-select-label">
                          Days
                        </InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={daysOpen}
                          onClose={handleDaysClose}
                          onOpen={handleDaysOpen}
                          value={year}
                          label="Days"
                          onChange={handleDaysChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={2}>2 Year</MenuItem>
                          <MenuItem value={3}>3 Year</MenuItem>
                          <MenuItem value={4}>4 Year</MenuItem>
                          <MenuItem value={5}>5 Year</MenuItem>
                          <MenuItem value={6}>6 Year</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-lg-8">
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Referral Address
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          value={referrerAddress}
                          disabled
                          placeholder="000000...000000"
                          startAdornment={
                            <InputAdornment position="start">
                              <RecordVoiceOverOutlinedIcon />
                            </InputAdornment>
                          }
                          label="Referral Address"
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12 col-lg-4">
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel id="demo-controlled-open-select-label">
                          Addy
                        </InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={addyOpen}
                          onClose={handleAddyClose}
                          onOpen={handleAddyOpen}
                          value={addy}
                          label="Addy"
                          onChange={handleAddyChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={"Wise Team Referral"}>
                            Wise Team Referral
                          </MenuItem>
                          <MenuItem value={"Cookie Reffral Addy"}>
                            Cookie Reffral Addy
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <Typography gutterBottom>
                      By clicking the <strong>Create Regular Stake</strong>{" "}
                      button below you agree that provided values are accurate
                      and reviewed before the final decission is made.
                    </Typography>
                  </div>
                  <div className="row">
                    {renderButtonInactive ? (
                      <Button
                        style={{ marginBottom: "20px", backgroundColor: '#08209e0F', color: 'white' }}
                        disabled
                        fullWidth
                        size="large"
                        variant="contained"

                      >
                        Create Stake
                      </Button>
                    ) : (
                      <Button
                        style={{ marginBottom: "20px", backgroundColor: '#08209e' }}
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => {
                          props.createStakeMakeDeploy(
                            percentagedBalance,
                            days,
                            referrerAddress,
                            false
                          );
                        }}
                      >
                        Create Stake
                      </Button>
                    )}
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="text-center filter-widget">
                    <Typography
                      variant="h5"
                      style={{ fontWeight: "600" }}
                      gutterBottom
                    >
                      Staking Summary
                    </Typography>
                    <Typography gutterBottom style={{ color: "#a6a6b9" }}>
                      Estimated SHRS for opening new stake
                    </Typography>
                  </div>
                  <Typography style={{ padding: "10px" }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <KeyboardDoubleArrowRightIcon /> Staking Shares
                      </div>
                      <div
                        className="col-md-12 col-lg-4"
                        style={{ textAlign: "right" }}
                      >
                        {percentagedBalance ? (parseFloat(percentagedBalance / (props?.globalData?.sharePrice ? props?.globalData?.sharePrice / 10 ** 9 : 0))) : (0)} SHRS
                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: "10px" }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <KeyboardDoubleArrowRightIcon /> Duration Bonus
                      </div>
                      <div
                        className="col-md-12 col-lg-4"
                        style={{ textAlign: "right", color: 'green', fontWeight: 'bold' }}
                      >
                        +{Number(durationBonus).toFixed(2)}%

                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: "10px" }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <KeyboardDoubleArrowRightIcon /> Referral Bonus
                      </div>
                      <div
                        className="col-md-12 col-lg-4"
                        style={{ textAlign: "right", color: 'green', fontWeight: 'bold' }}
                      >
                        {referrerAddress ? "+10.00%" : "+0.00%"}
                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: "10px" }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <ReceiptIcon /> <strong>Total Estimated Shares</strong>
                      </div>
                      <div
                        className="col-md-12 col-lg-4"
                        style={{ textAlign: "right" }}
                      >
                        {percentagedBalance ? ((parseFloat(percentagedBalance / (props?.globalData?.sharePrice ? props?.globalData?.sharePrice / 10 ** 9 : 0))) + parseFloat(percentagedBalance / (props?.globalData?.sharePrice ? props?.globalData?.sharePrice / 10 ** 9 : 0)) * (durationBonus / 100) + (referrerAddress ? parseFloat(percentagedBalance / (props?.globalData?.sharePrice ? props?.globalData?.sharePrice / 10 ** 9 : 0)) * (10 / 100) : 0)).toFixed(2) : (0)}  SHRS
                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: "10px" }}>
                    <div className="row">
                      <Typography gutterBottom>
                        <AccessAlarmTwoToneIcon />
                        <strong> Regular Staking </strong>
                      </Typography>
                      <Typography gutterBottom>
                        Regular staking are subject to penalities if ended
                        pre-meturely. Panalities span between 90% to 10%.
                      </Typography>
                    </div>
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

export default StakingWISEModal;
