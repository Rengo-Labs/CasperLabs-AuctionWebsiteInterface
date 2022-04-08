import { makeStyles } from "@material-ui/core/styles";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FilterListIcon from "@mui/icons-material/FilterList";
import LanIcon from "@mui/icons-material/Lan";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { StyledEngineProvider } from "@mui/styled-engine";
import axios from "axios";
import {
  CasperServiceByJsonRPC, CLPublicKey
} from "casper-js-sdk";
import { useSnackbar } from "notistack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from "../../../assets/img/cspr.png";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import {
  ROUTER_PACKAGE_HASH
} from "../../../components/blockchain/AccountHashes/Addresses";
import { getStateRootHash } from "../../../components/blockchain/GetStateRootHash/GetStateRootHash";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import HeaderHome from "../../../components/Headers/Header";
import { AppContext } from "../../App/Application";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function Refer(props) {
  const { enqueueSnackbar } = useSnackbar();
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  let [mainPurse, setMainPurse] = useState();

  const { activePublicKey } = useContext(AppContext);


  console.log("selectedWallet", selectedWallet);



  useEffect(() => {
    if (
      activePublicKey !== "null" &&
      activePublicKey !== null &&
      activePublicKey !== undefined
    ) {
      const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
      getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
        console.log("stateRootHash", stateRootHash);
        console.log(
          "CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),",
          CLPublicKey.fromHex(activePublicKey).toAccountHashStr()
        );
        client
          .getBlockState(
            stateRootHash,
            CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
            []
          )
          .then((result) => {
            console.log("result", result.Account.mainPurse);
            setMainPurse(result.Account.mainPurse);
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response);
          });
      });
    }
  }, [activePublicKey]);

  const [table, setTable] = useState(0);
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
            selectedNav={"Refer"}
          />
          <div
            className="content"
            style={{ paddingTop: "100px" }}
            position="absolute"
          ></div>
          <div>
            <div className="container-fluid mx-auto">
              <div className="d-flex">
                {/* <div className="refer-icon mt-2 mb-3"> */}
                <div className="card shadow m-0 rounded-lg">
                  <div className="card-body accessAlarm">
                    <RecordVoiceOverIcon fontSize="large" />
                  </div>
                </div>
                {/* </div> */}
                <div className="row no-gutters ml-3 align-items-center">
                  <section>
                    <h1 className="text-dark font-weight-bold m-0 wiseStaking-heading">
                      Wise Referrals
                    </h1>
                    <p className="m-0 text-muted wiseStaking-caption">
                      Stakes opened with your referral address
                    </p>
                  </section>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between bb">
                  <div className="d-flex">
                    <div
                      className=" ml-2 my-4 px-3 pt-3 "
                      style={{
                        backgroundColor: "#484DA4",
                        borderRadius: "500px",
                      }}
                    >
                      <h5 className="text-white">0%</h5>
                    </div>
                    <div className="ml-2">
                      <p className="text-secondary pt-3">status not achieved</p>
                      <h4 className="text-dark">Critical Mass Referrer</h4>
                    </div>
                  </div>
                  <div className="d-flex mr-2">
                    <div className="refer-table-icon my-4">
                      <AddBoxIcon fontSize="small" />
                    </div>
                    <div className="refer-table-icon my-4">
                      <FilterListIcon fontSize="small" />
                    </div>
                    <div className="refer-table-icon my-4">
                      <AutorenewIcon fontSize="small" />
                    </div>
                  </div>
                </div>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  <TableContainer sx={{ p: 3 }}>
                    <Table aria-label="Wise Staking">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REFFERED STAKE START
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REFFERAL SPIN
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            {" "}
                            CONTRIBUTOR
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            {" "}
                            REFFERAL ID
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            STAKE ID
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REFFERED AMOUNT
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            REWARDS/SHARES
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                            ACTIONS
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody></TableBody>
                    </Table>
                    <div className="pt-5 text-center">
                      <div className="mx-auto w-100">
                        <div className="row no-gutters justify-content-center align-items-center">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              height: 80,
                              width: 80,
                              backgroundColor: "#eceef7",
                              borderRadius: "50%",
                            }}
                          >
                            <LanIcon
                              sx={{
                                color: "rgb(234, 52, 41)",
                                fontSize: "44px",
                              }}
                            />
                          </div>
                        </div>
                        <h3 className="pt-5" style={{ color: "#EA3429" }}>
                          You don't have critical mass referrer status yet
                        </h3>
                        <h5 className="text-dark">
                          Start{" "}
                          <span className="font-weight-bold">promoting</span>{" "}
                          Wise by creating your{" "}
                          <span className="font-weight-bold">
                            referral link
                          </span>
                        </h5>
                        <button
                          onClick={() => setModalShow(true)}
                          className="my-3 tableBtn"
                        >
                          Create Wise Refferal Link
                        </button>
                        <Modal
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          className="text-white"
                        >
                          <Modal.Header
                            closeButton
                            style={{ backgroundColor: "white" }}
                          >
                            <Modal.Title
                              id="contained-modal-title-vcenter"
                              style={{ marginLeft: "40%", color: "#484DA4" }}
                            >
                              Your Refferal Link
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="text-dark">
                            <p className="text-center">
                              Stakes opened through this link will generate
                              rewards for staker and referrer. To participate
                              you must have CM referrer status by referring
                              total of $10,000 equivalent in WISE stakes.
                            </p>
                            <p className="text-center">
                              Note: referrer rewards are only generated for
                              stakes with minimum duration of 365 days.
                            </p>

                            {activePublicKey === null ? (
                              <h4 className="text-center">
                                {" "}
                                https://wisetoken.net/?w=YOUR-WALLET-ADDRESS
                              </h4>
                            ) : (
                              <h4 className="text-center">
                                https://wisetoken.net/?w={activePublicKey}
                              </h4>
                            )}
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
                                      "https://wisetoken.net/?w=" +
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
                      </div>
                    </div>
                  </TableContainer>
                  <StyledEngineProvider injectFirst>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      className="MuiTablePagination "
                    />
                  </StyledEngineProvider>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Refer;
