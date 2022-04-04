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

function InsuranceStakingTable() {
  const [stakes, setStakes] = React.useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    STAKE CREATED
                  </TableCell>
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    STAKE PROGRESS
                  </TableCell>
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    {" "}
                    LOCK UP
                  </TableCell>
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    {" "}
                    STAKE ID
                  </TableCell>
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    AMOUNT STAKED
                  </TableCell>
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    INTEREST/APY
                  </TableCell>
                  <TableCell sx={{ border: 0, fontWeight: "bold" }}>
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*{rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}  */}
              </TableBody>
            </Table>
            {stakes.length !== 0 ? null : (
              <div className="m-auto w-100">
                <TableDefault
                  message="You don't have insurance stakes at the moment"
                  advice="Start earning interest by creating your first stake"
                />

                <div className="row no-gutters justify-content-center align-items-center">
                  <WiseStakingTableButtons
                    btnContent={"Create Insurance Stake (WISE)"}
                  />
                  <WiseStakingTableButtons
                    btnContent={"Create Insurance Stake (CSPR)"}
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
              count={rows.length}
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

export default InsuranceStakingTable;
