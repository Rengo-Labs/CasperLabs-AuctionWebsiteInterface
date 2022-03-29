import {
  Card,
  CardContent,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import AccessAlarmTwoToneIcon from "@mui/icons-material/AccessAlarmTwoTone";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
// import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
// import SpatialAudioOffIcon from '@material-ui-icons/SpatialAudioOff';
// import SpatialAudioOffOutlinedIcon from '@mui/icons-material/SpatialAudioOffOutlined';
// import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";
import {
  AccessRights,
  CasperServiceByJsonRPC,
  CLByteArray,
  CLKey,
  CLOption,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import { getStateRootHash } from "../blockchain/GetStateRootHash/GetStateRootHash";
import { useState, useEffect } from "react";
import axios from "axios";
import { type } from "express/lib/response";

// -------------------- CONTENT --------------------

function StakingCSPRModal(props) {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );

  const [year, setYear] = useState("");
  const [days, setDays] = useState("");
  const [daysOpen, setDaysOpen] = useState(false);
  const [cspr, setCspr] = useState(10);
  const [percentagedCsprBalance, setPercentagedCsprBalance] = useState();
  const [balance, setBalance] = useState("");
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [addy, setAddy] = useState("");
  const [addyOpen, setAddyOpen] = useState(false);
  const [mainPurse, setMainPurse] = useState();
  const [referrer, setReferrer] = useState();
  const [referrerAddress, setReferrerAddress] = useState();

  const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
  getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
    // console.log("stateRootHash", stateRootHash);
    client
      .getBlockState(
        stateRootHash,
        CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
        []
      )
      .then((result) => {
        console.log("result of getStateRootHash: ", result);
        setMainPurse(result.Account.mainPurse);
        try {
          const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
          console.log("Root Hash:", stateRootHash);
          client
            .getAccountBalance(stateRootHash, result.Account.mainPurse)
            .then((result) => {
              console.log("CSPR balance", result.toString());
              // setCspr(result.toString());
            });
        } catch (error) {
          console.log("error", error);
        }
      });
  });

  useEffect(() => {
    axios
      .post("/getStakeData", {
        stakerId: "123",
      })
      .then((res) => {
        console.log("Referer: ", res.data.stakesData[0].referrer);
        setReferrer(res.data.stakesData[0].referrer);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }, []);

  const balanceOnChange = (event) => {
    let value = event.target.value;
    setCspr(value);
    if (value == 25) {
      setBalance(25);
    } else if (value == 50) {
      setBalance(50);
    } else if (value == 75) {
      setBalance(75);
    } else {
      console.log("empty");
      setBalance("");
    }
  };

  const handleBalanceChange = (event) => {
    let value = event.target.value;
    setBalance(value);
    setPercentagedCsprBalance((cspr * value) / 100);
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
  };

  const handleDaysClose = () => {
    setDaysOpen(false);
  };

  const handleDaysOpen = () => {
    setDaysOpen(true);
  };

  const handleAddyChange = (event) => {
    setAddy(event.target.value);
    setReferrerAddress(referrer);
  };

  const handleAddyClose = () => {
    setAddyOpen(false);
  };

  const handleAddyOpen = () => {
    setAddyOpen(true);
  };

  // if(typeof referrerAddress !== 'undefined' && typeof )

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
                          Staking amount
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          value={percentagedCsprBalance}
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
                          CSPR
                        </InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={balanceOpen}
                          onClose={handleBalanceClose}
                          onOpen={handleBalanceOpen}
                          value={balance}
                          label="CSPR"
                          onChange={handleBalanceChange}
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
                            setDays(e.target.value);
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
                          // onChange={handleChange('amount')}
                          placeholder="hash-000000000000...000000000000"
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
                  {/* <div className="row">
                    <FormControlLabel
                      value="end"
                      control={<Checkbox />}
                      label={`I would like to open this stake as insurance Stake`}
                      labelPlacement="end"
                    />
                    {<Chip label="REVIEW APPROVAL" />}
                  </div> */}
                  <hr />
                  <div className="row">
                    <Typography gutterBottom>
                      By clicking the <strong>Create Regular Stake</strong>{" "}
                      button below you agree that provided values are accurate
                      and reviewed before the final decission is made.
                    </Typography>
                  </div>
                  <div className="row">
                    <Button
                      style={{ marginBottom: "20px" }}
                      variant="primary"
                      disabled
                      block
                      size="lg"
                    >
                      Create Stake
                    </Button>
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
                        0.00 SHRS
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
                        style={{ textAlign: "right" }}
                      >
                        +0.00%
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
                        style={{ textAlign: "right" }}
                      >
                        +0.00%
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
                        0.00 SHRS
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

export default StakingCSPRModal;
