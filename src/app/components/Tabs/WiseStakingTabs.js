// React
import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
// Material UI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { StyledEngineProvider } from "@mui/styled-engine";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
// Components
import WiseStakingTable from "../Tables/WiseStakingTable";
import InsuranceStakingTable from "../Tables/InsuranceStakingTable";
import CollateralStakingTable from "../Tables/CollateralStakingTable";
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";
import { AppContext } from "../../containers/App/Application";
import {
  CasperServiceByJsonRPC,
  CLByteArray,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import {
  ROUTER_PACKAGE_HASH,
  WISE_CONTRACT_HASH,
} from "../blockchain/AccountHashes/Addresses";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import Torus from "@toruslabs/casper-embed";
import { useSnackbar } from "notistack";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { CHAINS, SUPPORTED_NETWORKS } from "../Headers/Header";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";
//Custom CSS
import "../../assets/css/stakingTabs.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function WiseStakingTabs() {
  const { activePublicKey } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  let [torus] = useState();
  const [value, setValue] = useState(0);
  const [stakes] = useState([]);
  const [regularStaking] = useState(0);
  const [insuranceStaking] = useState(0);
  const [collateralStaking] = useState(0);
  const [stakeData, setStakeData] = useState([]);
  const [openSigning, setOpenSigning] = useState(false);
  let [selectedWallet] = useState(localStorage.getItem("selectedWallet"));

  let regStake = `Regular Staking  (${regularStaking})`;
  let insureStake = `Insurance Staking  (${insuranceStaking})`;
  let collStake = `Collateral Staking  (${collateralStaking})`;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  const handleCloseSigning = () => {
    setOpenSigning(false);
  };

  useEffect(() => {
    axios
      .post("/getStakeData", { stakerId: "123" })
      .then((res) => {
        console.log("getStakeData", res.data);
        console.log("getStakeData", res.data.stakesData);
        res.data.stakesData[1] = res.data.stakesData[0];
        setStakeData(res.data.stakesData);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  }, [activePublicKey]);

  async function unstakeMakeDeploy(stakeData) {
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    console.log(activePublicKey);
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const spender = ROUTER_PACKAGE_HASH;
      const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );
      const paymentAmount = 5000000000;
      try {
        console.log(stakeData);
        const runtimeArgs = RuntimeArgs.fromMap({
          stake_id: CLValueBuilder.string(stakeData.id),
        });

        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(WISE_CONTRACT_HASH, "hex")
        );
        let entryPoint = "end_stake_Jsclient";
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        console.log(selectedWallet);
        try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
            console.log("result", result);
          } else {
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("unstaked Succesfully", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Unstake", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Input values are too large", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Casper Signer Please", { variant });
    }
  }

  const stake = stakeData.map((stakeData, index) => {
    return (
      <TableRow
        key={index}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>{stakeData.createdAt}</TableCell>
        <TableCell>{stakeData.lockDays}</TableCell>
        <TableCell>{stakeData.lockDays}</TableCell>
        <TableCell>{stakeData.id}</TableCell>
        <TableCell>{stakeData.principal}</TableCell>
        <TableCell>{stakeData.reward}</TableCell>
        <TableCell>
          <button onClick={() => unstakeMakeDeploy(stakeData)} className="btn">
            Unstake
          </button>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Box sx={{ width: "100%", marginTop: 7 }}>
      <Box
        sx={{
          padding: "20px",
          border: 1,
          borderBottom: 0,
          borderColor: "divider",
          borderTopRightRadius: "8px",
          borderTopLeftRadius: "8px",
        }}
      >
        <StyledEngineProvider injectFirst>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
            className="MuiTabs-scroller"
          >
            <Tab
              icon={<AccessAlarmIcon />}
              iconPosition="start"
              label={regStake}
              {...a11yProps(0)}
            />
            <Tab
              icon={<GppGoodOutlinedIcon />}
              iconPosition="start"
              label={insureStake}
              {...a11yProps(1)}
            />
            <Tab
              icon={<AccountBalanceIcon />}
              iconPosition="start"
              label={collStake}
              {...a11yProps(2)}
            />
          </Tabs>
        </StyledEngineProvider>
      </Box>
      <TabPanel value={value} index={0}>
        {stake.length !== 0 && activePublicKey !== null ? (
          <div className="row no-gutters buttonsWrapper">
            <WiseStakingTableButtons
              btnContent={"Create Regular Stake (WISE)"}
            />
            <WiseStakingTableButtons
              btnContent={"Create Regular Stake (CSPR)"}
              cspr={true}
            />
          </div>
        ) : null}

        <WiseStakingTable stake={stake} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {stakes.length !== 0 && activePublicKey !== null ? (
          <div className="row no-gutters buttonsWrapper">
            <WiseStakingTableButtons
              btnContent={"Create Insurance Stake (WISE)"}
            />
            <WiseStakingTableButtons
              btnContent={"Create Insurance Stake (CSPR)"}
              cspr={true}
            />
          </div>
        ) : null}
        <InsuranceStakingTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {stakes.length !== 0 && activePublicKey !== null ? (
          <div className="row no-gutters buttonsWrapper">
            <WiseStakingTableButtons
              btnContent={"Create Collateral Stake (WISE)"}
            />
            <WiseStakingTableButtons
              btnContent={"Create Collateral Stake (CSPR)"}
              cspr={true}
            />
          </div>
        ) : null}
        <CollateralStakingTable />
      </TabPanel>
    </Box>
  );
}

export default WiseStakingTabs;