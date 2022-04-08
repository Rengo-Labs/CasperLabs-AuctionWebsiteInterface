// React
import React from "react";
// Bootstrap
import "../../assets/css/bootstrap.min.css";
// Custom Styling
import "../../assets/css/cards.css";
// Material UI Icons
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function HomeCards(props) {
  return (
    <>
      <div className="card cardSkeleton border-secondary">
        <div className="card-body pb-0">
          <div className="cardContent w-75">
            <h3>{props.stake}</h3>
          </div>
          <div className="row no-gutters justify-content-between align-items-center w-100">
            <div className="divider"></div>
            <ChevronRightIcon fontSize="large" />
          </div>
          <div className="titleWrapper">
            <div className="row no-gutters align-items-center">
              <h6
                className="m-0 mr-2"
                style={{ color: "black", fontWeight: "bold" }}
              >
                {props.title}
              </h6>
              <HelpOutlineIcon
                className="helpOutlineIcon"
                sx={{ fontSize: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeCards;
