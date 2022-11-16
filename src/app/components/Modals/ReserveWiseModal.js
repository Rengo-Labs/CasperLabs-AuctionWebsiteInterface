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
import { AccountCircle, CalendarViewWeekTwoTone } from "@mui/icons-material";
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CSPR from '../../assets/img/cspr.png';
import { Avatar, Box, Card, CardHeader, TextField, Typography } from '@mui/material';

function ReserveWiseModal(props) {
  const [reservationAmount, setReservationAmount] = useState();

  const handleReservationAmount = (event) => {
    setReservationAmount(event.target.value);
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
              avatar={<Avatar sx={{ bgcolor: 'white', color: 'red' }} aria-label="Date" >
                <CalendarTodayTwoToneIcon />
              </Avatar>}
              title={new Date().toLocaleDateString("en-US")}
            />
            {props.globalReservationDaysData ? (
              <>
                <CardHeader className="text-center"
                  avatar={<Avatar sx={{ bgcolor: 'white', color: 'red' }} aria-label="Totals" >
                    <PersonOutlineOutlinedIcon />
                  </Avatar>}
                  title={props.globalData ? (props.globalData?.userCount) : (0)}
                />
                <CardHeader className="text-center" style={{ color: 'gray' }}
                  avatar={<Avatar src={CSPR} aria-label="Caspers" />}
                  title={props.globalData ? (props.globalData?.totalScsprContributed / 10 ** 9) : (0.0)}
                />
              </>
            ) : (null)}


          </Stack>

        </Card>
      </Modal.Body>
      <Modal.Body>
        <hr></hr>


        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Avatar src={CSPR} aria-label="Caspers" />
          <TextField fullWidth type='number'
            InputProps={{ inputProps: { min: 0.001, step: 0.001 } }}
            value={reservationAmount}
            onChange={handleReservationAmount}
            id="input-with-amount" label="Amount" variant="standard" />
        </Box>

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
