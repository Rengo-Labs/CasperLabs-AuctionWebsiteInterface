
import { CardActions, CardMedia, Chip, Container, Grid, LinearProgress } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Button, Col, Row } from 'react-bootstrap';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import CSPR from '../../../assets/img/cspr.png';
import Mode1 from '../../../assets/img/Mode1.svg';
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";

import { red } from '@material-ui/core/colors';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import { CLPublicKey } from 'casper-js-sdk';
import { AppContext } from '../../../containers/App/Application';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    badge: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    card: {
        minWidth: 250,
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));


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



function Mode1Cashback(props) {
    // console.log("props", props)
    // console.log("props.", props.findIndexOfDay(props.day));
    // console.log("props.globalReservationDaysData[props.findIndex(props.day)]?.userCount", props.globalReservationDaysData);
    const { activePublicKey } = useContext(AppContext);
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={6} >
            <Paper elevation={3} style={{ height: "100%" }}>
                <Grid container spacing={2} style={{ padding: "20px" }}>
                    <Grid item xs={4}>
                        <CardMedia
                            component="img"
                            image={Mode1}
                            alt="Mode1"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <CardHeader
                            title={`Mode 01 — “Cashback”`}
                            subheader={`Reserving tokens with this mode grants 1% cashback instantly, however it is active only for the first 40,000 BNB invested through this mode.`}
                        />
                    </Grid>

                </Grid>

                <Container>
                    <Row>
                        <Col>
                            {props.userReservationDaysData && props.findIndexOfDay(props.userReservationDaysData, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")) != -1 ? (
                                <Paper elevation={3} disabled className="text-center" style={{ padding: '10px', borderRadius: '35px', backgroundColor: '#08209e0f' }}>
                                    you have no contributions to this mode
                                </Paper>
                            ) : (
                                <Stack className="align-items-center" direction="row" spacing={1}>
                                    <CardHeader className="text-center"
                                        avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="Date" >
                                            <CalendarTodayTwoToneIcon />
                                        </Avatar>}
                                        title={new Date(props?.selectedDate).toLocaleDateString("en-US")}
                                    />
                                    {props.globalReservationDaysData ? (
                                        <>
                                            <CardHeader className="text-center"
                                                avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="Totals" >
                                                    <PersonOutlineOutlinedIcon />
                                                </Avatar>}
                                                title={props.findIndexOfDay(props.globalReservationDaysData, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))]?.userCount) : (0)}
                                            />
                                            <CardHeader className="text-center" style={{ color: 'gray' }}
                                                avatar={<Avatar src={CSPR} aria-label="Capsers" />}
                                                title={props.findIndexOfDay(props.globalReservationDaysData, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))]?.actualWei / 10 ** 9) : (0)}
                                            />
                                        </>
                                    ) : (null)}


                                </Stack>
                            )}
                        </Col>
                    </Row>
                </Container>
                {/* <Row> */}

                {/* </Row> */}
                {/* <CardContent>



                    <Typography style={{ margin: '10px' }} variant="body1" color="textSecondary" component="p">

                        <CardHeader
                            avatar={
                                <AccessTimeIcon />
                            }

                            title={<strong>
                                {(1666093832105 - new Date().getTime() / 1000) + ((props.day - 1) * 86400) < 0 ? (
                                    'Closed'
                                ) : (
                                    'Closing in ' + toDaysMinutesSeconds((1664520921 - new Date().getTime() / 1000) + ((props.day - 1) * 86400))
                                )}

                            </strong>}
                        // subheader={new Date(stakeData?.endDay * 1000).toDateString().split(' ').slice(1).join(' ')}
                        />
                    </Typography>

                </CardContent> */}
                {/* <hr /> */}
                <CardActions style={{ paddingBottom: '30px', paddingTop: '20px' }}>
                    <Container>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Total  💰 5,654.220 CSPR
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Cash Back  💸 56.542 CSPR
                                </Typography>

                            </Grid>
                            <Grid xs={6}>


                                {((1666950812 - new Date().getTime() / 1000) + (6 * 86400) < 0) ? (
                                    props.userReservationDaysData && props.findIndexOfDay(props.userReservationDaysData, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")) != -1 ? (
                                        < Button
                                            className="text-center"
                                            block
                                            onClick={() => {
                                                props.setSelectedDate((new Date().getTime()));
                                                props.setSelectedDay(props.day);
                                                props.claimWiseMakeDeploy()
                                            }}
                                        >
                                            Claim Wise
                                        </Button>
                                    ) : (
                                        <Button
                                            className="text-center"
                                            block
                                            disabled
                                        >
                                            Closed
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        className="text-center"
                                        block
                                        onClick={() => {
                                            props.setSelectedDate((new Date().getTime()) + ((props.day - 1) * 86400));
                                            props.setSelectedDay(props.day);
                                            props.handleShowReservationModal()
                                        }}
                                    >
                                        Reserve Wise
                                    </Button>

                                )}
                                <Typography variant="caption" display="block" gutterBottom className="text-center">
                                    Minimum 0.001 CSPR
                                </Typography>

                            </Grid>
                        </Grid>
                        <div className="text-center">
                            <Chip
                                style={{ backgroundColor: '#08209e0f' }}
                                className="text-center"
                                avatar={<AccessTimeIcon />}
                                label={((1666950812 - new Date().getTime() / 1000) + ((15) * 86400)) < 0 ? ('Reservation Closed') : ('Closing in ' + toDaysMinutesSeconds((1666950812 - new Date().getTime() / 1000) + ((6) * 86400)))}
                                variant="outlined"
                            />
                        </div>
                    </Container>
                </CardActions>
                {/* <Container style={{ marginBottom: '20px' }}>
                    <Row className="text-center">
                        <Col>
                            <Typography variant="body1" color="textSecondary" component="p">
                                Your Share
                            </Typography>
                            <Typography variant="body1" color="textPrimary" component="p">
                                0% WISE
                                {props.findIndexOfDay(props.globalReservationDaysData, props.day) != -1 ? (((props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, props.day)]?.actualWei / props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, props.day)]?.maxSupply) * 100).toFixed(9) + '%') : (0 + '%')}
                            </Typography>
                        </Col>
                        <Col>
                            <Typography variant="body1" color="textSecondary" component="p">
                                Your Contribution
                            </Typography>
                            <Typography variant="body1" color="textPrimary" component="p">
                                {props.findIndexOfDay(props.globalReservationDaysData, props.day) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.globalReservationDaysData, props.day)]?.actualWei / 10 ** 9) : 0} CSPR
                            </Typography>
                        </Col>

                    </Row>
                </Container> */}

            </Paper>
        </Grid >
    );
}

export default Mode1Cashback;