// React
import React, { useContext, useState } from "react";
// Components
import { AppContext } from "../../containers/App/Application";
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";
import TableDefault from "../DefaultContent/TableDefault";
// Material UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { StyledEngineProvider } from "@mui/styled-engine";
// Bootstrap
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import "../../assets/css/bootstrap.min.css";
// Custom CSS
import CloseIcon from '@mui/icons-material/Close';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Button, CardHeader } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useMedia } from "react-use";
import "../../assets/css/stakingTables.css";
import { addDays, currentStakeableDay, toDaysMinutesSeconds, toHex } from "../Helpers/Helper";
import ProgressBar from "../ProgressBar/ProgressBar";
// Content
const cells = [
  "STAKE CREATED",
  "STAKE PROGRESS",
  "LOCK UP",
  "STAKE ID",
  "AMOUNT STAKED",
  "INTEREST/APY",
  "ACTIONS",
];

function WiseStakingTable(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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




  return (
    <Box
      sx={{
        width: "100%",
        borderTop: 0,
      }}
    >
      <StyledEngineProvider injectFirst>
        <Paper sx={{ width: "100%", mb: 2 }} className="MuiPaper">
          <TableContainer sx={{ p: 3 }}>
            <Table aria-label="Wise Staking">
              <TableHead>
                <TableRow>
                  {cells.map((cell, index) => (
                    <TableCell key={index} style={{ marginLeft: 'auto', marginTop: 'auto' }} sx={{ border: 0, fontWeight: "bold" }}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>

                {
                  props.stakeData.length === 0 || activePublicKey === null ? null :
                    (rowsPerPage > 0
                      ? props.stakeData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : props.stakeData
                    ).map((stakeData, index) => (
                      <TableRow
                        key={index}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell>
                          <CardHeader
                            avatar={

                              <Avatar sx={{
                                bgcolor:
                                  parseInt(stakeData.closeDay) !== 0 ? (
                                    "#FF0000"
                                  ) : (
                                    currentStakeableDay() <= parseInt(stakeData.startDay) ? ('#A020F0') : (currentStakeableDay() < parseInt(stakeData.startDay) + parseInt(stakeData.lockDays)) ? ("#FFA500") : ("#59981A"))
                              }} aria-label="Access">
                                <AccessAlarmIcon />
                              </Avatar>
                            }

                            title={<strong>{weekday[new Date(stakeData?.createdAt).getDay()]}</strong>}
                            subheader={new Date(stakeData?.createdAt).toDateString().split(' ').slice(1).join(' ')}
                          />

                        </TableCell>
                        <TableCell>
                          {/* {stakeData.lockDays} */}
                          <Box sx={{ width: '100%' }}>
                            {/* {console.log("currentStakeableDay()", currentStakeableDay())}
                            {console.log("parseInt(stakeData.startDay) + parseInt(stakeData.lockDays))", parseInt(stakeData.startDay))} */}
                            {console.log("addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.closeDay)).getTime())", addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.closeDay)).getTime())}
                            {console.log("2", addDays(addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.currentStakeableDay)), 0).getTime())}
                            {
                              parseInt(stakeData.closeDay) !== 0 ? (

                                <ProgressBar bgcolor="#FF0000" progress={
                                  100
                                } height={20} backgroundColor="#FF00001F" />
                              ) : (
                                currentStakeableDay() <= parseInt(stakeData.startDay) ?
                                  (
                                    <ProgressBar bgcolor="#A020F0" progress={0} height={20} backgroundColor="#A020F01F" />
                                  ) : (currentStakeableDay() < parseInt(stakeData.startDay) + parseInt(stakeData.lockDays)) ?
                                    (
                                      <ProgressBar bgcolor="#FFA500" progress={
                                        ((((new Date().getTime()) - addDays(
                                          addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.currentStakeableDay)), 0).getTime())) / (
                                            addDays(
                                              addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.currentStakeableDay)), stakeData?.lockDays).getTime() -
                                            addDays(addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.currentStakeableDay)), 0).getTime()) * 100).toFixed(2)
                                      } height={20} backgroundColor="#FFA5001F" />
                                    ) : (
                                      <ProgressBar bgcolor="#59981A" progress={100} height={20} backgroundColor="#59981A1F" />
                                    )
                              )
                            }
                            {/* <LinearProgressWithLabel value={(((new Date().getTime() / 1000) - addDays(stakeData?.createdAt, 1).getTime() / 1000)) / (addDays(stakeData?.createdAt, stakeData?.lockDays).getTime() / 1000 - addDays(stakeData?.createdAt, 1).getTime() / 1000) * 100} /> */}

                          </Box>

                        </TableCell>
                        <TableCell>
                          <CardHeader
                            avatar={
                              <span></span>
                            }

                            title={
                              parseInt(stakeData.closeDay) !== 0 ? (
                                <strong>{'Closed On'}</strong>)
                                : (
                                  currentStakeableDay() <= parseInt(stakeData.startDay) ? (<strong>Starts On</strong>) :
                                    (currentStakeableDay() < parseInt(stakeData.startDay) + parseInt(stakeData.lockDays)) ?
                                      (<strong>{toDaysMinutesSeconds(addDays(addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.currentStakeableDay)), parseInt(stakeData?.lockDays)).getTime() / 1000 - new Date().getTime() / 1000) + ' left'}</strong>) : (
                                        <strong>Matured</strong>
                                      )
                                )}
                            subheader={
                              parseInt(stakeData.closeDay) !== 0 ? (
                                addDays(stakeData?.createdAt, parseInt(stakeData.currentStakeableDay) > parseInt(stakeData.closeDay) ? (parseInt(stakeData.currentStakeableDay) - parseInt(stakeData.closeDay)) : (parseInt(stakeData.closeDay) - parseInt(stakeData.currentStakeableDay))).toDateString().split(' ').slice(1).join(' ')
                              ) : (
                                currentStakeableDay() <= parseInt(stakeData.startDay) ? (
                                  addDays(stakeData?.createdAt, parseInt(stakeData.startDay) - parseInt(stakeData.currentStakeableDay)).toDateString().split(' ').slice(1).join(' ')
                                ) :
                                  (addDays(addDays(stakeData?.createdAt, (parseInt(stakeData.startDay)) - parseInt(stakeData.currentStakeableDay)), stakeData?.lockDays).toDateString().split(' ').slice(1).join(' '))
                                //new Date(stakeData?.endDay * 1000).toDateString().split(' ').slice(1).join(' ')4
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>

                          <CardHeader
                            avatar={
                              <span></span>
                            }

                            title={<strong>{below1200 ? toHex(stakeData.id)?.slice(0, 4) + '...' + toHex(stakeData.id)?.slice(60, 64) : toHex(stakeData.id)?.slice(0, 12) + '...' + toHex(stakeData.id)?.slice(52, 64)}</strong>}
                            subheader={
                              parseInt(stakeData.closeDay) !== 0 ? (
                                <div style={{ display: 'flex' }}>
                                  <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#FF0000' }}>

                                  </span>
                                  <span style={{ color: '#FF0000' }}>
                                    Closed
                                  </span>
                                </div>
                              ) : (
                                currentStakeableDay() <= parseInt(stakeData.startDay) ?
                                  (
                                    <div style={{ display: 'flex' }}>
                                      <span className="circle" style={{ marginTop: '5px', marginRight: '5px', backgroundColor: '#A020F0' }}>
                                      </span>
                                      <span style={{ color: '#A020F0' }}>
                                        Pending
                                      </span>
                                    </div>
                                  ) : (currentStakeableDay() < parseInt(stakeData.startDay) + parseInt(stakeData.lockDays)) ?
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
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <CardHeader
                            avatar={
                              <span></span>
                            }

                            title={<strong>{stakeData.principal / 10 ** 9} WISE</strong>}
                            subheader={stakeData.shares / 10 ** 9 + " SHRS"}
                          />
                        </TableCell>
                        <TableCell>{stakeData.reward / 10 ** 9}</TableCell>
                        <TableCell>
                          <Button variant="contained" size="small" style={{ margin: '5px', backgroundColor: '#08209e' }} onClick={() => {
                            props.setStakeDetail(stakeData);
                            props.handleShowHistoricalSummaryModal()
                          }}>
                            <SearchIcon />
                          </Button>
                          {parseInt(stakeData.closeDay) !== 0 ? (
                            <Button disabled variant="contained" size="small" style={{ margin: '5px', backgroundColor: '#08209e5f' }}>
                              <CloseIcon />
                            </Button>
                          ) : (
                            <Button variant="contained" size="small" style={{ margin: '5px', backgroundColor: '#08209e' }} onClick={() => props.unstakeMakeDeploy(stakeData)}>
                              <CloseIcon />
                            </Button>
                          )}

                        </TableCell>
                      </TableRow>
                    ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {/* <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={props.stakeData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter> */}
            </Table>

            {props.stakeData.length !== 0 && activePublicKey !== null ? null : (
              <div className="m-auto w-100">
                <TableDefault
                  message="You don't have regular stakes at the moment"
                  advice="Start earning interest by creating your first stake"
                />
                <div className="row no-gutters justify-content-center align-items-center">
                  <WiseStakingTableButtons
                    btnContent={"Create Regular Stake (WISE)"}
                  />
                  <WiseStakingTableButtons
                    btnContent={"Create Regular Stake (CSPR)"}
                    cspr={true}
                  />
                </div>
              </div>
            )}
          </TableContainer>

          <StyledEngineProvider injectFirst>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={props.stakeData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="MuiTablePagination"
            />
            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={props.stakeData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            /> */}
            {/* <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={props.stakeData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </StyledEngineProvider>
        </Paper>
      </StyledEngineProvider>
    </Box>
  );
}

export default WiseStakingTable;
