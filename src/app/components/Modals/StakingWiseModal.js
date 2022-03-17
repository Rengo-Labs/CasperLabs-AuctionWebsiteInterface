import { Card, CardContent, FormControlLabel, Typography } from "@material-ui/core";
import AccessAlarmTwoToneIcon from "@mui/icons-material/AccessAlarmTwoTone";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
// import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
// import SpatialAudioOffIcon from '@material-ui-icons/SpatialAudioOff';
// import SpatialAudioOffOutlinedIcon from '@mui/icons-material/SpatialAudioOffOutlined';
// import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import React from "react";
import { Button, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
function StakingWiseModal(props) {
  return (
    <Modal size="xl"
      centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{
        color: '#000027',
        fontWeight: '600'
      }}>

        <Card style={{ marginBottom: "10px", borderRadius: "8px" }}>
          <CardContent>
            <div className="container-fluid">
              <span onClick={props.handleClose} style={{ float: "right", cursor: "pointer" }}>
                <img src={Exit} alt="exit" width="15" />
              </span>
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  <div className="text-center filter-widget">
                    <Typography variant="h5" style={{ fontWeight: '600' }} gutterBottom >
                      Input Details
                    </Typography>
                    <Typography gutterBottom style={{ color: '#a6a6b9' }} >
                      Estimated SHRS for opening new Stake
                    </Typography>
                  </div>
                  <div className="row">
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">Staking amount</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        // value={values.amount}
                        // onChange={handleChange('amount')}
                        placeholder="Staking Amount"
                        startAdornment={<InputAdornment position="start"><AlarmOnIcon /></InputAdornment>}
                        label="Staking Amount"
                      />
                    </FormControl>
                  </div>
                  <div className="row">
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">Staking Duration</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        // value={values.amount}
                        // onChange={handleChange('amount')}
                        placeholder="Staking Duration"
                        startAdornment={<InputAdornment position="start"><AccountBalanceWalletOutlinedIcon /></InputAdornment>}
                        label="Staking Duration"
                      />
                    </FormControl>
                  </div>
                  <div className="row">
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">Referral Address</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        // value={values.amount}
                        // onChange={handleChange('amount')}
                        placeholder="hash-000000000000...000000000000"
                        startAdornment={<InputAdornment position="start"><RecordVoiceOverOutlinedIcon /></InputAdornment>}
                        label="Referral Address"
                      />
                    </FormControl>
                  </div>
                  <div className="row">
                    <FormControlLabel
                      value="end"
                      control={<Checkbox />}
                      label={`I would like to open this stake as insurance Stake`}
                      labelPlacement="end"
                    />
                    {<Chip label="REVIEW APPROVAL" />}
                  </div>
                  <hr />
                  <div className="row">
                    <Typography gutterBottom >
                      By clicking the <strong>Create Regular Stake</strong> button below you agree that provided values are accurate and reviewed before the final decission is made.
                    </Typography>
                  </div>
                  <div className="row">
                    <Button style={{ marginBottom: '20px' }} variant="primary" disabled block size="lg">
                      Connect to Wallet
                    </Button>
                  </div>

                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="text-center filter-widget">
                    <Typography variant="h5" style={{ fontWeight: '600' }} gutterBottom >
                      Staking Summary
                    </Typography>
                    <Typography gutterBottom style={{ color: '#a6a6b9' }}>
                      Estimated SHRS for opening new stake
                    </Typography>
                  </div>
                  <Typography style={{ padding: '10px' }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <KeyboardDoubleArrowRightIcon /> Staking Shares
                      </div>
                      <div className="col-md-12 col-lg-4" style={{ textAlign: "right" }} >
                        0.00 SHRS
                      </div>
                    </div>

                  </Typography>
                  <hr />
                  <Typography style={{ padding: '10px' }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <KeyboardDoubleArrowRightIcon /> Duration Bonus
                      </div>
                      <div className="col-md-12 col-lg-4" style={{ textAlign: "right" }} >
                        +0.00%
                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: '10px' }}>
                    <div className="row" >
                      <div className="col-md-12 col-lg-8">
                        <KeyboardDoubleArrowRightIcon /> Referral Bonus
                      </div>
                      <div className="col-md-12 col-lg-4" style={{ textAlign: "right" }} >
                        +0.00%
                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: '10px' }}>
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <ReceiptIcon /> <strong>Total Estimated Shares</strong>
                      </div>
                      <div className="col-md-12 col-lg-4" style={{ textAlign: "right" }} >
                        0.00 SHRS
                      </div>
                    </div>
                  </Typography>
                  <hr />
                  <Typography style={{ padding: '10px' }}>
                    <div className="row" >
                      <Typography gutterBottom >
                        <AccessAlarmTwoToneIcon /><strong> Regular Staking </strong>
                      </Typography>
                      <Typography gutterBottom >
                        Regular staking are subject to penalities if ended pre-meturely. Panalities span between 90% to 10%.
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

export default StakingWiseModal;
