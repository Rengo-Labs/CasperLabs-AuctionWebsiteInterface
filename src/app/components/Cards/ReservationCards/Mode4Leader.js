
import { CardActions, CardMedia, Container, Grid, LinearProgress, Paper } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, Row } from 'react-bootstrap';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import CSPR from '../../../assets/img/cspr.png';
import Mode4 from '../../../assets/img/Mode4.svg';
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";


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



function Mode4Leader(props) {
    // console.log("props", props)
    // console.log("props.", props.findIndexOfDay(props.day));
    // console.log("props.globalReservationDaysData[props.findIndex(props.day)]?.userCount", props.globalReservationDaysData);
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={6} >
            <Paper elevation={3} style={{ height: "100%" }}>
                <Grid container spacing={2} style={{ padding: "20px" }}>
                    <Grid item xs={4}>
                        <CardMedia
                            component="img"
                            image={Mode4}
                            alt="Mode4"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <CardHeader
                            title={`Mode 04 — “$10,000 Leader”`}
                            subheader={`Reserving tokens with this mode allows users to enter a competition where $10,000 goes to the largest investor and an additional $10,000 to a random investor using this mode.`}
                        />
                    </Grid>

                </Grid>
                <Container>
                    <Row>
                        <Col>
                            <Paper elevation={3} disabled className="text-center" style={{ padding: '10px', borderRadius: '35px', backgroundColor: '#08209e0f' }}>
                                you have no contributions to this mode
                            </Paper>
                        </Col>
                    </Row>
                </Container>
                <CardActions style={{ paddingBottom: '30px', paddingTop: '20px' }}>
                    <Container>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Leader  👑 417.6 CSPR
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Total  🛒 70 Users

                                </Typography>

                            </Grid>
                            <Grid xs={6}>
                                {((1664520921 - new Date().getTime() / 1000) + ((props.day - 1) * 86400) < 0 && props.findIndexOfDay(props.userReservationDaysData, props.day) == -1) || !props.userReservationDaysData ? (
                                    <Button
                                        className="text-center"
                                        block
                                        disabled
                                    >
                                        Reserve Wise
                                    </Button>

                                ) : (


                                    props.userReservationDaysData && props.findIndexOfDay(props.userReservationDaysData, props.day) != -1 ? (
                                        < Button
                                            className="text-center"
                                            block
                                            onClick={() => {
                                                props.setSelectedDate((new Date().getTime()) + ((props.day - 1) * 86400));
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
                                            onClick={() => {
                                                props.setSelectedDate((new Date().getTime()) + ((props.day - 1) * 86400));
                                                props.setSelectedDay(props.day);
                                                props.handleShowReservationModal()
                                            }}
                                        >
                                            Reserve Wise
                                        </Button>

                                    )



                                )}
                                <Typography variant="caption" display="block" gutterBottom className="text-center">
                                    Minimum 18 CSPR
                                </Typography>

                            </Grid>
                        </Grid>
                    </Container>
                </CardActions>

            </Paper>
        </Grid >
    );
}

export default Mode4Leader;