// React
import React from "react";
import { useState } from "react";

// Material UI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { StyledEngineProvider } from "@mui/styled-engine";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";

// Components
import WiseStakingTable from "../Tables/WiseStakingTable";
import WiseStakingTableButtons from "../Buttons/WiseStakingTableButtons";

//Custom CSS
import "../../assets/css/wiseStakingTabs.css";

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

function WiseStakingTabs({handleShowStakingWiseModal}) {
  const [value, setValue] = React.useState(0);
  const [regularStaking, setRegularStaking] = useState(0);
  const [insuranceStaking, setInsuranceStaking] = useState(0);
  const [collateralStaking, setCollateralStaking] = useState(0);

  let regStake = `Regular Staking  (${regularStaking})`;
  let insureStake = `Insurance Staking  (${insuranceStaking})`;
  let collStake = `Collateral Staking  (${collateralStaking})`;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        // className="shadow"
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
        <div className="row no-gutters buttonsWrapper">
          <WiseStakingTableButtons handleShowStakingWiseModal={handleShowStakingWiseModal} btnContent={"Create Regular Stake (WISE)"} />
          <WiseStakingTableButtons handleShowStakingWiseModal={handleShowStakingWiseModal} btnContent={"Create Regular Stake (ETH)"} />
        </div>
        <WiseStakingTable handleShowStakingWiseModal={handleShowStakingWiseModal} />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <div className="row no-gutters buttonsWrapper">
          <WiseStakingTableButtons handleShowStakingWiseModal={handleShowStakingWiseModal} btnContent={"Create Regular Stake (WISE)"} />
          <WiseStakingTableButtons handleShowStakingWiseModal={handleShowStakingWiseModal} btnContent={"Create Regular Stake (ETH)"} />
        </div>
        <WiseStakingTable handleShowStakingWiseModal={handleShowStakingWiseModal} />
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div className="row no-gutters buttonsWrapper">
          <WiseStakingTableButtons handleShowStakingWiseModal={handleShowStakingWiseModal} btnContent={"Create Regular Stake (WISE)"} />
          <WiseStakingTableButtons handleShowStakingWiseModal={handleShowStakingWiseModal} btnContent={"Create Regular Stake (ETH)"} />
        </div>
        <WiseStakingTable handleShowStakingWiseModal={handleShowStakingWiseModal} />
      </TabPanel>
    </Box>
  );
}

export default WiseStakingTabs;
