import { Avatar, Card, CardHeader, Typography } from "@material-ui/core";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Casper from "../../assets/img/cspr.png";
import Torus from "../../assets/img/torus.png";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function WalletModal(props) {
  // console.log("props", props);
  return (
    <Modal centered show={props.show} onHide={props.handleClose}>
      {/* <Modal.Header style={{ textAlign: 'center' }}>
      </Modal.Header> */}
      <Modal.Body style={{ textAlign: 'center' }} >
        <Typography variant="h5" style={{ color: '#000027' }} gutterBottom >
          <strong>
            Select Wallet
            <span
              onClick={props.handleClose}
              style={{
                float: "right",
                cursor: "pointer",
                fontSize: '15px'
              }}
            >
              X
            </span>
          </strong>
        </Typography>

      </Modal.Body>
      <Modal.Body>
        <Card
          onClick={() => {
            props.torusLogin();
            props.setSelectedWallet("Torus");
            localStorage.setItem("selectedWallet", "Torus");
          }}
          className="custom-card"
          style={{ borderRadius: "8px"}}
        >
          <CardHeader
            avatar={<Avatar src={Torus} aria-label="Torus Wallet" />}
            title="Torus Wallet"
            subheader="Connect to Torus Waller"
          />
        </Card>
        <hr></hr>
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
        </Card>
      </Modal.Body>
    </Modal>
  );
}

export default WalletModal;
