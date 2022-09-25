// React
import React, { useContext, useEffect, useState } from "react";
// Material UI
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { StyledEngineProvider } from "@mui/styled-engine";
import PropTypes from "prop-types";
// Components
import LinearProgress from '@mui/material/LinearProgress';
import Torus from "@toruslabs/casper-embed";
import {
  CasperServiceByJsonRPC,
  CLByteArray,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs
} from "casper-js-sdk";
import { useSnackbar } from "notistack";
import { AppContext } from "../../containers/App/Application";
import {
  ROUTER_PACKAGE_HASH,
  WISE_CONTRACT_HASH
} from "../blockchain/AccountHashes/Addresses";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";
import { CHAINS, SUPPORTED_NETWORKS } from "../Headers/Header";
import CollateralStakingTable from "../Tables/CollateralStakingTable";
import InsuranceStakingTable from "../Tables/InsuranceStakingTable";
import WiseStakingTable from "../Tables/WiseStakingTable";
//Custom CSS
import "../../assets/css/stakingTabs.css";
import { Avatar, CardHeader } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'
import Axios from "axios";

TimeAgo.addDefaultLocale(en)


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


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};


function WiseStakingTabs() {
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { activePublicKey } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  let [torus] = useState();
  const [value, setValue] = useState(0);
  const [stakes] = useState([]);
  const [regularStaking] = useState(0);
  const [insuranceStaking] = useState(0);
  const [collateralStaking] = useState(0);
  // const [stakeData, setStakeData] = useState([]);
  const [openSigning, setOpenSigning] = useState(false);
  let [selectedWallet] = useState(localStorage.getItem("selectedWallet"));

  let regStake = `Regular Staking  (${regularStaking})`;
  let insureStake = `Insurance Staking  (${insuranceStaking})`;
  let collStake = `Collateral Staking  (${collateralStaking})`;
  const [progress, setProgress] = React.useState(10);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  const handleCloseSigning = () => {
    setOpenSigning(false);
  };

  let [stakeData, setStakeData] =
    useState([]
      // [{
      //   closeDay: "15000000000",
      //   cmShares: "100000000000",
      //   createdAt: "2022-07-18T13:03:22.836Z",
      //   currentShares: "99000000000",
      //   daiEquivalent: "123",
      //   id: "123",
      //   lastScrapeDay: "15000000000",
      //   lockDays: "730",
      //   lockDaysSeconds: 730 * 24 * 60 * 60,
      //   penalty: "10000000000",
      //   principal: "10000000000",
      //   referrer: "123",
      //   referrerSharesPenalized: "1000000000",
      //   reward: "10000000000",
      //   scrapeCount: "1",
      //   scrapedYodas: "10000000000",
      //   shares: "100000000000",
      //   sharesPenalized: "1000000000",
      //   staker: "123",
      //   startDay: "2022-07-18T13:03:24.506Z",
      //   startDayTimeStamp: Math.floor(new Date("Fri Aug 19 2022 18:10:20").getTime() / 1000),
      //   updatedAt: "2022-07-18T13:03:24.506Z",
      // }, {
      //   closeDay: "15000000000",
      //   cmShares: "100000000000",
      //   createdAt: "2022-07-18T13:03:22.836Z",
      //   currentShares: "99000000000",
      //   daiEquivalent: "123",
      //   id: "123",
      //   lastScrapeDay: "15000000000",
      //   lockDays: "365",
      //   lockDaysSeconds: 365 * 24 * 60 * 60,
      //   penalty: "10000000000",
      //   principal: "10000000000",
      //   referrer: "123",
      //   referrerSharesPenalized: "1000000000",
      //   reward: "10000000000",
      //   scrapeCount: "1",
      //   scrapedYodas: "10000000000",
      //   shares: "100000000000",
      //   sharesPenalized: "1000000000",
      //   staker: "123",
      //   startDay: "2022-07-18T13:03:24.506Z",
      //   startDayTimeStamp: Math.floor(new Date("2022-07-18T13:03:24.506Z").getTime() / 1000),
      //   updatedAt: "2022-07-18T13:03:24.506Z",
      // }]
    )
  function toDaysMinutesSeconds(totalSeconds) {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const days = Math.floor(totalSeconds / (3600 * 24));

    const secondsStr = makeHumanReadable(seconds, 'second');
    const minutesStr = makeHumanReadable(minutes, 'minute');
    const hoursStr = makeHumanReadable(hours, 'hour');
    const daysStr = makeHumanReadable(days, 'day');

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(/,\s*$/, '');
  }

  function makeHumanReadable(num, singular) {
    return num > 0
      ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `)
      : '';
  }

  useEffect(() => {
    Axios
      .post("/getStakeData", { stakerId: "123" })
      .then((res) => {
        // console.log("getStakeData", res.data);
        console.log("getStakeData", res.data.stakesData);
        res.data.stakesData[1] = res.data.stakesData[0];
        for (let index = 0; index < res.data.stakesData.length; index++) {
          console.log("res.data.stakeData", res.data.stakesData);
          console.log("new Date().getTime()", new Date().getTime());
          res.data.stakesData[index].lockDays = "5"
          res.data.stakesData[index].staker = "account-hash-4a2d7b35723a70c69e0f4c01df65df9bf8dced1d1542f11426aed570bcf2cbab"
          res.data.stakesData[index].startDay = 1663154999
          res.data.stakesData[index].closeDay = 1664160300
          res.data.stakesData[index].lockDaysSeconds = Number(res.data.stakesData[index].lockDays) * 24 * 60 * 60
          res.data.stakesData[index].endDay = res.data.stakesData[index].startDay + res.data.stakesData[index].lockDaysSeconds

          let start = 1
          let current = 11.5
          let end = 100
          console.log("testtt", ((current - start) / end) * 100);
          console.log("(new Date().getTime() / 1000)", (((res.data.stakesData[index].startDay + res.data.stakesData[index].lockDaysSeconds / 2) - res.data.stakesData[index].startDay)) / (res.data.stakesData[index].endDay - res.data.stakesData[index].startDay) * 100);
          // console.log("res.data.stakesData[index].startDay", res.data.stakesData[index].startDay);
          // console.log("res.data.stakesData[index].endDay", res.data.stakesData[index].endDay);
          // console.log("(new Date().getTime() / 1000)", (new Date().getTime() / 1000) - res.data.stakesData[index].startDay);

          console.log("1000", (((new Date().getTime() / 1000) - res.data.stakesData[index].startDay)) / (res.data.stakesData[index].endDay - res.data.stakesData[index].startDay) * 100);
          // console.log("stakeData.endDay - new Date().getTime() / 1000) / stakeData.endDay", ((new Date().getTime() / 1000) / res.data.stakesData[index].endDay) * 100);
        }
        setStakeData(res.data.stakesData);
        // console.log("stakeData", stakeData);
        // console.log("stakeData.startDayTimeStamp", stakeData[0].startDayTimeStamp);
        // console.log("lockDaysSeconds", stakeData[0].lockDaysSeconds);
        // let lastDay = stakeData[0].startDayTimeStamp + stakeData[0].lockDaysSeconds
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
    // let count = 0;
    // const interval = setInterval(() => {
    //   setProgress(count);
    //   count++;
    // }, 100);
    // return () => clearInterval(interval);


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
        <TableCell>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
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
            <LinearProgressWithLabel value={(((new Date().getTime() / 1000) - stakeData.startDay)) / (stakeData.endDay - stakeData.startDay) * 100} />
          </Box>

        </TableCell>
        <TableCell>
          <CardHeader
            avatar={
              <span></span>
            }

            title={<strong>{toDaysMinutesSeconds(stakeData.endDay - new Date().getTime() / 1000) + ' left'}</strong>}
            subheader={new Date(stakeData?.endDay * 1000).toDateString().split(' ').slice(1).join(' ')}
          />
        </TableCell>
        <TableCell>

          <CardHeader
            avatar={
              <span></span>
            }

            title={<strong>{stakeData.staker}</strong>}
            subheader={"OnGoing"}
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
        <TableCell>{stakeData.reward}</TableCell>
        <TableCell>
          <button onClick={() => unstakeMakeDeploy(stakeData)} className="btn">
            Unstake
            { }
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
