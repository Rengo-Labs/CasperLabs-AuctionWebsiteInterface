import { CardContent, Typography } from "@material-ui/core";
import { Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { AppContext } from "../../containers/App/Application";



// -------------------- COMPONENT FUNCTION --------------------
function ReferalModal(props) {
  const { activePublicKey } = useContext(AppContext);

  // -------------------- Life Cycle Methods--------------------


  // -------------------- Event Handlers --------------------

  // -------------------- jsx --------------------

  return (
    <Modal size="xl" centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{ textAlign: "center" }}>
        <Typography variant="h5" style={{ color: "#000027" }} gutterBottom>
          <strong>
            Your Refferal Link
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
      <Modal.Body
        style={{
          color: "#000027",
          fontWeight: "600",
        }}
      >
        <CardContent>
          <div className="container-fluid">
            <div className="text-center">
              <Typography gutterBottom >
                Stakes opened through this link will generate
                rewards for staker and referrer. To participate
                you must have CM referrer status by referring
                total of $10,000 equivalent in WISE stakes.
              </Typography>
            </div>
            <Typography gutterBottom >
              <Alert severity="info">
                Note: referrer rewards are only generated for
                stakes with minimum duration of 365 days.</Alert>
            </Typography>

            {activePublicKey === null ? (
              <div className="text-center ">
                <Typography gutterBottom variant="h6" >
                  {" "}
                  http://localhost:3001/home/YOUR-WALLET-ADDRESS
                </Typography>
              </div>
            ) : (
              <div className="text-center">
                <Typography gutterBottom variant="h6" >
                  http://localhost:3001/home/{activePublicKey}
                </Typography>
              </div>
            )}


          </div>
        </CardContent>
        {/* </Card> */}
      </Modal.Body>
      <Modal.Footer>
        {activePublicKey === null ? (
          <div className="mx-auto">
            <button
              disabled
              className="btn disabled"
              onClick={() => {
                navigator.clipboard.writeText(
                  activePublicKey
                );
              }}
            >
              Copy Refferal Link
            </button>
          </div>
        ) : (
          <div className="mx-auto">
            <button
              className="tableBtn"
              onClick={() => {
                navigator.clipboard.writeText(
                  "http://localhost:3001/home/" +
                  activePublicKey
                );
                toast.success(
                  "Successfully Copied wallet",
                  { id: "copyActivePublicKey" }
                );
              }}
            >
              Copy Refferal Link
            </button>
            <Toaster />
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ReferalModal;
