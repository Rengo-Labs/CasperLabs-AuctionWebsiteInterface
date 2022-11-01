// React
import React from "react";
import { useState, useEffect, useContext } from "react";
// Components
import TableDefault from "../DefaultContent/TableDefault";
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";
import { AppContext } from "../../containers/App/Application";
// Material UI
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { StyledEngineProvider } from "@mui/styled-engine";
// Bootstrap
import "../../assets/css/bootstrap.min.css";
// Custom CSS
import "../../assets/css/stakingTables.css";

// Content
const cells = [
  "STAKE CREATED",
  "STAKE PROGRESS",
  "LOCK UP",
  // "STAKE ID",
  "AMOUNT STAKED",
  "INTEREST/APY",
  "ACTIONS",
];

function WiseStakingTable(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { activePublicKey } = useContext(AppContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                  {cells.map((cell) => (
                    <TableCell style={{ marginLeft: 'auto', marginTop: 'auto' }} sx={{ border: 0, fontWeight: "bold" }}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {activePublicKey === null ? null : props.stake}
              </TableBody>
            </Table>

            {props.stake.length !== 0 && activePublicKey !== null ? null : (
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
              count={cells.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="MuiTablePagination"
            />
          </StyledEngineProvider>
        </Paper>
      </StyledEngineProvider>
    </Box>
  );
}

export default WiseStakingTable;
