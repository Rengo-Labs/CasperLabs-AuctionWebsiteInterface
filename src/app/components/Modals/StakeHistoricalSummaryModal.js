import { Box, CardHeader, Grid, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DoneIcon from '@mui/icons-material/Done';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import LockIcon from '@mui/icons-material/Lock';
import Masonry from '@mui/lab/Masonry';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}


function StakeHistoricalSummaryModal(props) {
  console.log("stakeData", props);

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function toDays(totalSeconds) {
    const days = Math.floor(totalSeconds / (3600 * 24));
    return `${days}`.replace(/,\s*$/, '');
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  return (
    <Modal size="xl" centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{ textAlign: "center" }}>
        <Typography variant="h5" style={{ color: "#000027" }} gutterBottom>
          <strong>
            {'Stake Historical Summary'}
            <span
              onClick={props.handleClose}
              style={{
                float: "right",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              <img src={Exit} alt="exit" width="15" />
            </span>
          </strong>
        </Typography>
      </Modal.Body>
      <Modal.Body >
        <Alert variant="outlined" severity="warning">
          Your Stake With Id <strong>{props.stakeData.id}</strong> was started on <strong>{new Date(props.stakeData.startDay).toLocaleDateString("en-US")}</strong> and will mature <strong>in {toDays(props.stakeData.endDay - new Date().getTime() / 1000)} Days</strong> reaching remaining Possible reward.
          Scraping reward Prematurely will always result in penalties applied to stake shares and referral shares reducing the remaining possible reward for both.
        </Alert>
      </Modal.Body>
      <Modal.Body>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Timeline sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
              position="right">
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="primary">
                    <HourglassBottomIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <CardHeader
                    title={`${new Date(props.stakeData.createdAt).toLocaleDateString("en-US")} # Creation Day`}
                    subheader={
                      <>
                        <Typography>
                          Staked: {props.stakeData.principal / 10 ** 9} WISE
                        </Typography>
                        <Typography>
                          Generated: {props.stakeData.shares / 10 ** 9} SHRS
                        </Typography>
                        <Typography>
                          View Transaction
                        </Typography>
                      </>
                    }
                  />
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="warning">
                    <LockIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <CardHeader
                    title={`${new Date(props.stakeData.startDay).toLocaleDateString("en-US")} # Starting Day`}
                    subheader={
                      <>
                        <Typography>
                          Stake Lock: {props.stakeData.lockDays} Days Total
                        </Typography>
                      </>
                    }
                  />
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="warning">
                    <CalendarTodayIcon />
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: 'success.main' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <CardHeader
                    title={`${new Date().toLocaleDateString("en-US")} # Current Day`}
                    subheader={
                      <>
                        <Typography>
                          Available Reward: {props.stakeData.principal / 10 ** 9 - props.stakeData.penalty / 10 ** 9} WISE
                        </Typography>
                        <Button
                          className="text-center"
                          block
                          onClick={() => {
                          }}
                        >
                          Scrape Reward
                        </Button>
                      </>
                    }
                  />
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'success.main' }} />
                  <TimelineDot color="success">
                    <DoneIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <CardHeader
                    title={`${new Date(props.stakeData.endDay).toLocaleDateString("en-US")} # Final Day`}
                    subheader={
                      <>
                        <Typography>
                          Stake Unlock: {toDays(props.stakeData.endDay - new Date().getTime() / 1000)} Days Left
                        </Typography>
                      </>
                    }
                  />
                </TimelineContent>
              </TimelineItem>
            </Timeline>

          </Grid>
          <Grid item xs={windowDimensions.width < 997 ? 12 : 8}>
            <Box >
              <Masonry columns={windowDimensions.width < 997 ? 1 : 2} spacing={windowDimensions.width < 997 ? 1 : 2}>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Staked Amount`}
                        subheader={'Locked Tokens'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#08209e' }}>
                      <CardHeader
                        title={`${props.stakeData.principal / 10 ** 9} WISE`}
                      />
                    </Grid>
                  </Grid>
                </Item>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Staked Equivalent`}
                        subheader={'When openning stake'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#08209e' }}>
                      <CardHeader
                        title={`${props.stakeData.daiEquivalent} USD`}
                      />
                    </Grid>
                  </Grid>
                </Item>

                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Orignal Shares`}
                        subheader={'During Creation'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#08209e' }}>
                      <CardHeader
                        title={`${props.stakeData.shares / 10 ** 9} SHRS`}
                      />
                    </Grid>
                  </Grid>
                </Item>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Overall Reward`}
                        subheader={'Based on shares'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#08209e' }}>
                      <CardHeader
                        title={`${props.stakeData.reward / 10 ** 9} SHRS`}
                      />
                    </Grid>
                  </Grid>
                </Item>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Deducted Shares`}
                        subheader={'Penalties due scraping'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#FF9900' }}>
                      <CardHeader
                        title={`-${props.stakeData.sharesPenalized / 10 ** 9} SHRS`}
                      />
                    </Grid>
                  </Grid>
                </Item>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Scraped Reward`}
                        subheader={'Already issued'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#FF9900' }}>
                      <CardHeader
                        title={`-${props.stakeData.penalty / 10 ** 9} WISE`}
                      />
                    </Grid>
                  </Grid>
                </Item>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <CardHeader
                        title={`Active Shares`}
                        subheader={'Remaining amount'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#00FF00' }}>
                      <CardHeader
                        title={`${props.stakeData.shares / 10 ** 9 - props.stakeData.sharesPenalized / 10 ** 9} SHRS`}
                      />
                    </Grid>
                  </Grid>
                </Item>
                <Item elevation={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} style={{ marginLeft: '0px' }}>
                      <CardHeader
                        title={`Available Reward`}
                        subheader={'Remaining amount'}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: 'auto', marginBottom: 'auto', color: '#00FF00' }}>
                      <CardHeader
                        title={`${props.stakeData.principal / 10 ** 9 - props.stakeData.penalty / 10 ** 9} WISE`}
                      />
                    </Grid>
                  </Grid>
                </Item>
              </Masonry>
            </Box>
          </Grid>
        </Grid>
      </Modal.Body>
    </Modal>
  );
}

export default StakeHistoricalSummaryModal;
