
import { Button, CardHeader } from '@mui/material';
import { Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React from "react";
import { Col, Row } from 'react-bootstrap';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import CSPR from '../../assets/img/cspr.png';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { toDaysMinutesSeconds } from '../Helpers/Helper';




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


function ReservationCard(props) {
    // console.log("props", props)
    // console.log("props.", props.findIndexOfDay(props.day));
    // console.log("props.globalReservationDaysData[props.findIndex(props.day)]?.userCount", props.globalReservationDaysData);
    return (
        <Grid item xs={12} sm={6} md={4} >
            <Card style={{ height: "100%" }} variant="outlined">
                <CardHeader className="text-center"
                    title={"Day #" + props.day}
                />
                <CardHeader className="text-center" style={{ color: 'green' }}
                    title={"5,000,000 Wise "}
                />
                <Row>
                    <Col>
                        <CardHeader
                            avatar={
                                <Avatar style={{ color: 'red' }}>
                                    <PersonOutlineIcon />
                                </Avatar>
                            }

                            title={props.findIndexOfDay(props.userReservationDaysData, props.day) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.userReservationDaysData, props.day)]?.userCount) : (0)}
                            subheader={`Total Users`}
                        />
                    </Col>
                    <Col>
                        <CardHeader
                            avatar={
                                <Avatar src={CSPR}>
                                </Avatar>
                            }

                            title={props.findIndexOfDay(props.userReservationDaysData, props.day) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.userReservationDaysData, props.day)]?.actualWei / 10 ** 9) : 0}
                            subheader={`Total Casper`}
                        />
                    </Col>
                </Row>
                {/* <Row> */}

                {/* </Row> */}
                <CardContent>

                    {((1664520921 - new Date().getTime() / 1000) + ((props.day - 1) * 86400) < 0 && props.findIndexOfDay(props.userReservationDaysData, props.day) == -1) || !props.userReservationDaysData ? (
                        <Button
                            className="text-center"
                            style={{ color: 'white', backgroundColor: '#08209e5F' }}
                            fullWidth
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

                    <Typography style={{ margin: '10px' }} variant="body1" color="textSecondary" component="p">

                        <CardHeader
                            avatar={
                                <AccessTimeIcon />
                            }

                            title={<strong>
                                {(1664520921 - new Date().getTime() / 1000) + ((props.day - 1) * 86400) < 0 ? (
                                    'Closed'
                                ) : (
                                    'Closing in ' + toDaysMinutesSeconds((1664520921 - new Date().getTime() / 1000) + ((props.day - 1) * 86400))
                                )}

                            </strong>}
                        // subheader={new Date(stakeData?.endDay * 1000).toDateString().split(' ').slice(1).join(' ')}
                        />
                    </Typography>

                </CardContent>
                <hr />
                <CardActions>
                    <Box sx={{ width: '100%' }}>
                        <LinearProgressWithLabel value={(((1663285922908 / 1000) / (new Date().getTime() / 1000))) * 100} />
                    </Box>
                </CardActions>
                <Container style={{ marginBottom: '20px' }}>
                    <Row className="text-center">
                        <Col>
                            <Typography variant="body1" color="textSecondary" component="p">
                                Your Share
                            </Typography>
                            <Typography variant="body1" color="textPrimary" component="p">
                                0% WISE
                                {/* {actualWei} */}
                                {props.findIndexOfDay(props.userReservationDaysData, props.day) != -1 ? (((props.globalReservationDaysData[props.findIndexOfDay(props.userReservationDaysData, props.day)]?.actualWei / props.globalReservationDaysData[props.findIndexOfDay(props.userReservationDaysData, props.day)]?.maxSupply) * 100).toFixed(9) + '%') : (0 + '%')}
                            </Typography>
                        </Col>
                        <Col>
                            <Typography variant="body1" color="textSecondary" component="p">
                                Your Contribution
                            </Typography>
                            <Typography variant="body1" color="textPrimary" component="p">
                                {props.findIndexOfDay(props.userReservationDaysData, props.day) != -1 ? (props.globalReservationDaysData[props.findIndexOfDay(props.userReservationDaysData, props.day)]?.actualWei / 10 ** 9) : 0} CSPR
                            </Typography>
                        </Col>

                    </Row>
                </Container>

            </Card>
        </Grid >
    );
}

export default ReservationCard;