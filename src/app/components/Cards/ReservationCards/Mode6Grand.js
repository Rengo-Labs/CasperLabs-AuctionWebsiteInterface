

import { Button, CardActions, CardHeader, CardMedia, Container, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React from "react";
import { Col, Row } from 'react-bootstrap';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Mode6 from '../../../assets/img/Mode6.svg';
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";



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



function Mode6Grand(props) {
    // console.log("props", props)
    // console.log("props.", props.findIndexOfDay(props.day));
    // console.log("props.globalReservationDaysData[props.findIndex(props.day)]?.userCount", props.globalReservationDaysData);
    return (
        <Grid item xs={12} sm={6} md={6} >
            <Paper elevation={3} style={{ height: "100%" }}>
                <Grid container spacing={2} style={{ padding: "20px" }}>
                    <Grid item xs={4}>
                        <CardMedia
                            component="img"
                            image={Mode6}
                            alt="Mode6"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <CardHeader
                            title={`Mode 06 — “$100,000 Grand”`}
                            subheader={`Reserving tokens with this mode allows to enter a competition where $100,000 goes to the largest investor using this mode.`}
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
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Leader  🏆 1,918 CSPR
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Total  🐳 5 Users
                                </Typography>

                            </Grid>
                            <Grid item xs={6}>
                                {((1664520921 - new Date().getTime() / 1000) + ((props.day - 1) * 86400) < 0 && props.findIndexOfDay(props.userReservationDaysData, props.day) == -1) || !props.userReservationDaysData ? (
                                    <Button
                                        className="text-center"
                                        style={{ color: 'white', backgroundColor: '#08209e' }}
                                        fullWidth
                                        disabled
                                    >
                                        Reserve Wise
                                    </Button>

                                ) : (
                                    props.userReservationDaysData && props.findIndexOfDay(props.userReservationDaysData, props.day) != -1 ? (
                                        <Button
                                            className="text-center"
                                            style={{ color: 'white', backgroundColor: '#08209e' }}
                                            fullWidth
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
                                            style={{ color: 'white', backgroundColor: '#08209e' }}
                                            fullWidth
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
                                    Minimum 0.001 CSPR
                                </Typography>

                            </Grid>
                        </Grid>
                    </Container>
                </CardActions>
            </Paper>
        </Grid >
    );
}

export default Mode6Grand;