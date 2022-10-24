import { Avatar, Card, CardHeader, FormControl, Input, InputAdornment, InputLabel, Typography } from "@material-ui/core";
import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Casper from "../../assets/img/cspr.png";
import Exit from "../../assets/img/exit.svg";
import Torus from "../../assets/img/torus.png";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { CalendarViewWeekTwoTone } from "@mui/icons-material";
import { CalendarToday } from "@material-ui/icons";
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CSPR from '../../assets/img/cspr.png';
import { red } from "@material-ui/core/colors";

function ReserveWiseModal(props) {
  const [reservationAmount, setreservationAmount] = useState();

  const handleReservationAmount = (event) => {
    setreservationAmount(event.target.value);
  };


  return (
    <Modal centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{ textAlign: "center" }}>
        <Typography variant="h5" style={{ color: "#000027" }} gutterBottom>
          <strong>
            {'Reserve Wise Modal'}
            <span
              onClick={props.handleClose}
              style={{
                float: "right",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              <img src={Exit} alt="exit" width="15" />
            </span>
          </strong>
        </Typography>
      </Modal.Body>
      <Modal.Body>

        <Card
          onClick={() => {
          }}
          className="custom-card"
          style={{ borderRadius: "8px", padding: '15px' }}
        >
          <strong>
            <Stack className="align-items-center" direction="row" spacing={1}>
              <Chip label="Selected" color='success' />
              <Chip label="Fixed" style={{ backgroundColor: '#08209e', color: 'white' }} />
              {/* <CardHeader className="text-center" style={{ color: 'green' }}
                title={"5,000,000 Wise"}
              /> */}

            </Stack>
          </strong>
          <Stack className="align-items-center" direction="row" spacing={1}>
            <CardHeader className="text-center"
              avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="Date" >
                <CalendarTodayTwoToneIcon />
              </Avatar>}
              title={new Date(props?.selectedDate).toLocaleDateString("en-US")}
            />
            {props.globalReservationDaysData ? (
              <>
                <CardHeader className="text-center"
                  avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="Totals" >
                    <PersonOutlineOutlinedIcon />
                  </Avatar>}
                  title={props.findIndexOfDay(props.globalReservationDaysData, props.selectedDay) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, props.selectedDay)]?.userCount) : (0)}
                />
                <CardHeader className="text-center" style={{ color: 'gray' }}
                  avatar={<Avatar src={CSPR} aria-label="Capsers" />}
                  title={props.findIndexOfDay(props.globalReservationDaysData, props.selectedDay) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, props.selectedDay)]?.actualWei / 10 ** 9) : (0)}
                />
              </>
            ) : (null)}


          </Stack>

          {/* <CardHeader
            avatar={<Avatar src={Torus} aria-label="Torus Wallet" />}
            title="Torus Wallet"
            subheader="Connect to Torus Waller"
          /> */}
        </Card>
      </Modal.Body>
      <Modal.Body>
        <hr></hr>
        {/*
        <Card
          onClick={() => {
            props.casperLogin();
            localStorage.setItem("selectedWallet", "Casper");
            props.setSelectedWallet("Casper");
          }}
          className="custom-card"
          style={{ borderRadius: "8px" }}
        >
          <CardHeader
            avatar={<Avatar src={Casper} aria-label="Casper Signer" />}
            title="Casper Signer"
            subheader="Connect to Casper Signer"
          />
        </Card> */}
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
          <Input
            id="standard-adornment-amount"
            type='number'
            value={reservationAmount}
            onChange={handleReservationAmount}
            startAdornment={<InputAdornment position="start" ><Avatar src={CSPR} aria-label="Capsers" /></InputAdornment>}
          />
        </FormControl>

      </Modal.Body>

      <Modal.Footer>
        <Button
          style={{ marginBottom: "20px" }}
          variant="primary"
          block
          size="lg"
          onClick={() => props.reserveWiseMakeDeploy(reservationAmount)}
        >
          Confirm Transaction
        </Button>

      </Modal.Footer>
    </Modal>
  );
}

export default ReserveWiseModal;
