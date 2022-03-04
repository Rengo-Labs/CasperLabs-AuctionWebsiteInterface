import { Typography } from "@material-ui/core";
import React from "react";
import { Alert, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Spinner from "../Spinner/Spinner";

function SigningModal(props) {
    return (
        <Modal centered show={props.show}>
            <Modal.Body style={{ textAlign: 'center' }}>
                <Typography variant="h5" style={{ color: '#000027' }} gutterBottom ><strong>Sign Transaction</strong></Typography>
                <div className="row align-items-center justify-content-center">
                    <Spinner style={{ textAlign: 'center' }} />
                </div>
                <Typography variant="h5" style={{ color: '#000052' }} gutterBottom ><strong>Pending...</strong></Typography>
                <Alert color="light" style={{ color: '#000027' }}>
                    <strong>Waiting for your transaction to be picked up and included in the blockchain</strong>
                </Alert>
            </Modal.Body>

        </Modal>

    );
}

export default SigningModal;
