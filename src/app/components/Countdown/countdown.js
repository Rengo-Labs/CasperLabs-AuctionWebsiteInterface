import React from 'react';
import moment from 'moment';

const Countdown = ({ countdownTimer, unixEndDate }) => {
    console.log("countdownTimer", countdownTimer);
    console.log("unixEndDate", unixEndDate);
    return (
        <div className="countdown">
            <div className="card">
                <div className="countdown-value">{countdownTimer.days}</div>
                <div className="countdown-unit">Days</div>
            </div>
            <div className="card">
                <div className="countdown-value">{countdownTimer.hours}</div>
                <div className="countdown-unit">Hours</div>
            </div>
            <div className="card">
                <div className="countdown-value">{countdownTimer.mins}</div>
                <div className="countdown-unit">Mins</div>
            </div>
            <div className="card">
                <div className="countdown-value">{countdownTimer.secs}</div>
                <div className="countdown-unit">Secs</div>
            </div>
            <p>{moment.unix(unixEndDate).format('dddd, MMMM Do, YYYY | h:mm A')}</p>
        </div>
    );
}

export default Countdown;