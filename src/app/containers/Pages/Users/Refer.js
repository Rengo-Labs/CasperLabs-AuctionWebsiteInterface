import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from "@mui/icons-material/FilterList";
import LanIcon from "@mui/icons-material/Lan";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Box, Button, CardHeader } from "@mui/material";
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
import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useMedia } from "react-use";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { getStateRootHash } from "../../../components/blockchain/GetStateRootHash/GetStateRootHash";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import GlobalDataHeader from "../../../components/Headers/GlobalDataHeader";
import HeaderHome from "../../../components/Headers/Header";
import { addDays, currentStakeableDay, toDaysMinutesSeconds, toHex } from "../../../components/Helpers/Helper";
import ReferalModal from "../../../components/Modals/ReferalModal";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import { AppContext } from "../../App/Application";

function Refer(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie] = useCookies(["referee"]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  console.log("cookies", cookies);
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [userWiseBalance, setUserWiseBalance] = useState(0);
  let [torus, setTorus] = useState();
  let [mainPurse, setMainPurse] = useState();

  const { activePublicKey } = useContext(AppContext);
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const below1200 = useMedia('(max-width: 1200px)')
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.stakeData.length) : 0;




  console.log("selectedWallet", selectedWallet);
  useEffect(() => {
    const controller = new AbortController()
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
    return () => {
      controller.abort()
    }
  }, [activePublicKey]);

  const [table, setTable] = useState(0);
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const [open, setOpen] = React.useState(false);
  let [referrerData, setReferrerData] = useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [openReferalModal, setOpenReferalModal] = useState(false);
  const handleCloseReferalModal = () => {
    setOpenReferalModal(false);
  };
  const handleShowReferalModal = () => {
    setOpenReferalModal(true);
  };
  const [globalData, setGlobalData] = useState({});
  useEffect(() => {
    const controller = new AbortController()
    axios
      .get("/getGlobalData")
      .then((res) => {
        setGlobalData(res.data.globalData[0]);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
    return () => {
      controller.abort()
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController()
    let publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      getReferrerData()
    }
    // let count = 0;
    // const interval = setInterval(() => {
    //   setProgress(count);
    //   count++;
    // }, 100);
    // return () => clearInterval(interval);
    return () => {
      controller.abort()
    }

  }, [activePublicKey]);
  async function getReferrerData() {
    axios
      .get(`/getReferrerData/${Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")}`)
      .then((res) => {
        // console.log("getReferrerData", res.data);
        console.log("getReferrerData", res.data.referrerData);
        setReferrerData(res.data.referrerData);
        // console.log("referrerData", referrerData);
        // console.log("referrerData.startDayTimeStamp", referrerData[0].startDayTimeStamp);
        // console.log("lockDaysSeconds", referrerData[0].lockDaysSeconds);
        // let lastDay = referrerData[0].startDayTimeStamp + referrerData[0].lockDaysSeconds
        // let currentTImeStamp = Math.floor(Date.now() / 1000);
        // let pct = (100 * lastDay / currentTImeStamp).toFixed(2)
        // console.log("lastDay", lastDay);
        // console.log("currentTImeStamp", currentTImeStamp);
        // console.log("pct", pct);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }
  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setUserWiseBalance={setUserWiseBalance}
            setTorus={setTorus}
            selectedNav={"Refer"}
          />
          <div
            className=""
            style={{ paddingTop: "100px" }}
            position="absolute"
          ></div>
          <span className="d-flex justify-content-center">
            <GlobalDataHeader globalData={globalData}
            />
          </span>
          <div
            className=""
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
                <div className="row no-gutters ml-auto align-items-center">
                  <section >
                    <h1 className="text-dark font-weight-bold m-0 wiseStaking-heading">
                      {localStorage.getItem("Address") !== null && localStorage.getItem("Address") !== undefined && localStorage.getItem("Address") !== 'null' ? (
                        <CardHeader
                          avatar={<Avatar src="" aria-label="Torus Wallet" />}
                          title={<a
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
                          </a>}
                          subheader={`Total: ${userWiseBalance} WISE`}
                        />
                      ) : (null)}

                    </h1>
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
                            REFFERAL SPAN
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
                      {/* <TableBody> */}
                      <TableBody>

                        {
                          referrerData.length === 0 || activePublicKey === null ? null :
                            (rowsPerPage > 0
                              ? referrerData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              : referrerData
                            ).map((item, index) => (
                              <TableRow
                                key={index}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                              >
                                <TableCell>
                                  <CardHeader
                                    avatar={

                                      <Avatar sx={{
                                        bgcolor:
                                          parseInt(currentStakeableDay()) <= parseInt(item.startDay) ? ('#A020F0') : (currentStakeableDay() < parseInt(item.startDay) + parseInt(item.lockDays)) ? ("#FFA500") : ("#59981A")
                                      }} aria-label="Access">
                                        <AccessAlarmIcon />
                                      </Avatar>
                                    }

                                    title={<strong>{weekday[new Date(item?.createdAt).getDay()]}</strong>}
                                    subheader={new Date(item?.createdAt).toDateString().split(' ').slice(1).join(' ')}
                                  />

                                </TableCell>
                                <TableCell>
                                  {/* {item.lockDays} */}
                                  <Box sx={{ width: '100%' }}>
                                    {/* {console.log("currentStakeableDay()", currentStakeableDay())}
            {console.log("parseInt(item.startDay) + parseInt(item.lockDays))", parseInt(item.startDay))} */}
                                    {parseInt(currentStakeableDay()) <= parseInt(item.startDay) ?
                                      (
                                        <ProgressBar bgcolor="#A020F0" progress={0} height={20} backgroundColor="#A020F01F" />
                                      ) : (currentStakeableDay() < parseInt(item.startDay) + parseInt(item.lockDays)) ?
                                        (
                                          // <ProgressBar bgcolor="#FFA500" progress={
                                          100 - ((((new Date().getTime()) - addDays(
                                            addDays(item?.createdAt, (parseInt(item.startDay)) - parseInt(item.currentStakeableDay)), 0).getTime())) / (
                                              addDays(
                                                addDays(item?.createdAt, (parseInt(item.startDay)) - parseInt(item.currentStakeableDay)), item?.lockDays).getTime() -
                                              addDays(addDays(item?.createdAt, (parseInt(item.startDay)) - parseInt(item.currentStakeableDay)), 0).getTime()) * 100).toFixed(2) + "% Remaining"

                                        ) : (
                                          <ProgressBar bgcolor="#59981A" progress={100} height={20} backgroundColor="#59981A1F" />
                                        )
                                    }
                                    {/* <LinearProgressWithLabel value={(((new Date().getTime() / 1000) - addDays(item?.createdAt, 1).getTime() / 1000)) / (addDays(item?.createdAt, item?.lockDays).getTime() / 1000 - addDays(item?.createdAt, 1).getTime() / 1000) * 100} /> */}

                                  </Box>

                                </TableCell>
                                <TableCell>

                                  <CardHeader
                                    avatar={
                                      <span></span>
                                    }

                                    title={<strong>{below1200 ? item.staker?.slice(0, 4) + '...' + item.staker?.slice(60, 64) : item.staker?.slice(0, 12) + '...' + item.staker?.slice(52, 64)}</strong>}
                                    subheader={
                                      parseInt(currentStakeableDay()) <= parseInt(item.startDay) ?
                                        (
                                          <div style={{ display: 'flex' }}>
                                            <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#A020F0' }}>

                                            </span>
                                            <span style={{ color: '#A020F0' }}>
                                              Pending
                                            </span>


                                          </div>
                                        ) : (currentStakeableDay() < parseInt(item.startDay) + parseInt(item.lockDays)) ?
                                          (
                                            <div style={{ display: 'flex' }}>
                                              <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#FFA500' }}>

                                              </span>
                                              <span style={{ color: '#FFA500' }}>
                                                OnGoing
                                              </span>


                                            </div>
                                          ) : (
                                            <div style={{ display: 'flex' }}>
                                              <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#59981A' }}>

                                              </span>
                                              <span style={{ color: '#59981A' }}>
                                                Matured
                                              </span>


                                            </div>
                                          )
                                    }
                                  />
                                </TableCell>
                                <TableCell>

                                  <CardHeader
                                    avatar={
                                      <span></span>
                                    }

                                    title={<strong>{below1200 ? item.referrer?.slice(0, 4) + '...' + item.referrer?.slice(60, 64) : item.referrer?.slice(0, 12) + '...' + item.referrer?.slice(52, 64)}</strong>}
                                    subheader={
                                      parseInt(currentStakeableDay()) <= parseInt(item.startDay) ?
                                        (
                                          <div style={{ display: 'flex' }}>
                                            <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#A020F0' }}>

                                            </span>
                                            <span style={{ color: '#A020F0' }}>
                                              Pending
                                            </span>


                                          </div>
                                        ) : (currentStakeableDay() < parseInt(item.startDay) + parseInt(item.lockDays)) ?
                                          (
                                            <div style={{ display: 'flex' }}>
                                              <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#FFA500' }}>

                                              </span>
                                              <span style={{ color: '#FFA500' }}>
                                                OnGoing
                                              </span>


                                            </div>
                                          ) : (
                                            <div style={{ display: 'flex' }}>
                                              <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#59981A' }}>

                                              </span>
                                              <span style={{ color: '#59981A' }}>
                                                Matured
                                              </span>


                                            </div>
                                          )
                                    }
                                  />
                                </TableCell>
                                <TableCell>

                                  <CardHeader
                                    avatar={
                                      <span></span>
                                    }

                                    title={<strong>{below1200 ? toHex(item.id)?.slice(0, 4) + '...' + toHex(item.id)?.slice(60, 64) : toHex(item.id)?.slice(0, 12) + '...' + toHex(item.id)?.slice(52, 64)}</strong>}
                                    subheader={
                                      parseInt(currentStakeableDay()) <= parseInt(item.startDay) ?
                                        (
                                          <div style={{ display: 'flex' }}>
                                            <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#A020F0' }}>

                                            </span>
                                            <span style={{ color: '#A020F0' }}>
                                              Pending
                                            </span>


                                          </div>
                                        ) : (currentStakeableDay() < parseInt(item.startDay) + parseInt(item.lockDays)) ?
                                          (
                                            <div style={{ display: 'flex' }}>
                                              <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#FFA500' }}>

                                              </span>
                                              <span style={{ color: '#FFA500' }}>
                                                OnGoing
                                              </span>


                                            </div>
                                          ) : (
                                            <div style={{ display: 'flex' }}>
                                              <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#59981A' }}>

                                              </span>
                                              <span style={{ color: '#59981A' }}>
                                                Matured
                                              </span>


                                            </div>
                                          )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <CardHeader
                                    avatar={
                                      <span></span>
                                    }

                                    title={<strong>{item.principal / 10 ** 9} WISE</strong>}
                                    subheader={item.shares / 10 ** 9 + " SHRS"}
                                  />
                                </TableCell>
                                <TableCell>{item.reward}</TableCell>
                                <TableCell>
                                  <Button variant="contained" size="small" style={{ margin: '5px', backgroundColor: '#08209e' }} onClick={() => {
                                    props.setStakeDetail(item);
                                    props.handleShowHistoricalSummaryModal()
                                  }}>
                                    <SearchIcon />
                                  </Button>
                                  <Button variant="contained" size="small" style={{ margin: '5px', backgroundColor: '#08209e' }} onClick={() => props.unstakeMakeDeploy(item)}>
                                    <CloseIcon />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>


                      {/* </TableBody> */}
                    </Table>
                    {referrerData.length === 0 ? (
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
                            onClick={handleShowReferalModal}
                            className="my-3 tableBtn"
                          >
                            Create Wise Refferal Link
                          </button>

                        </div>
                      </div>
                    ) : (null)}
                  </TableContainer>
                  <StyledEngineProvider injectFirst>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={referrerData.length}
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
      <ReferalModal
        show={openReferalModal}
        handleClose={handleCloseReferalModal}
      />
    </div>
  );
}

export default Refer;
