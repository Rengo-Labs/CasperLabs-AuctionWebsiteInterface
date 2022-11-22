// React
import React from "react";
import { useState } from "react";
// Components
import TableDefault from "../DefaultContent/TableDefault";
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";
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
  "STAKE ID",
  "AMOUNT STAKED",
  "INTEREST/APY",
  "ACTIONS",
];

// -------------------- COMPONENT FUNCTION --------------------
function CollateralStakingTable() {
  const [stakes, setStakes] = React.useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // -------------------- Event Handlers --------------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // -------------------- jsx --------------------
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
                    <TableCell key={index} sx={{ border: 0, fontWeight: "bold" }}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
            </Table>
            {stakes.length !== 0 ? null : (
              <div className="m-auto w-100">
                <TableDefault
                  message="You don't have collateral stakes at the moment"
                  advice="Start earning interest by creating your first stake"
                />

                <div className="row no-gutters justify-content-center align-items-center">
                  <WiseStakingTableButtons
                    btnContent={"Create Collateral Stake (WISE)"}
                  />
                  <WiseStakingTableButtons
                    btnContent={"Create Collateral Stake (CSPR)"}
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

export default CollateralStakingTable;
