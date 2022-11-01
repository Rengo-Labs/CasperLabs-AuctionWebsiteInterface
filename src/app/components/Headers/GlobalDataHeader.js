import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Grid } from '@material-ui/core';


// console.log("torus", torus);

function GlobalDataHeader(props) {

  const [expanded, setExpanded] = React.useState(false);
  // console.log("props", props);
  const handleExpandClick = () => {
    setExpanded(!expanded);

  }
  return (
    <React.Fragment >
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="flex-start"
      // alignItems="flex-start"
      >
        <Grid item xs={12} sm={6} md={3} >
          <Card style={{ height: "100%" }} variant="outlined" >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="Global Stakes Staked">
                  <TrendingUpIcon />
                </Avatar>
              }

              title="GLOBAL WISE STAKED"
              subheader={`${props?.globalData?.totalStaked ? props.globalData.totalStaked / 10 ** 9 : 0} WISE`}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} >
          <Card style={{ height: "100%" }} variant="outlined" >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="GLobal Wise Shares">
                  <TrendingUpIcon />
                </Avatar>
              }

              title="GLOBAL WISE SHARES"
              subheader={`${props?.globalData?.totalShares ? props.globalData.totalShares / 10 ** 9 : 0} SHRS`}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} >
          <Card style={{ height: "100%" }} variant="outlined" >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="Global Referral Shares">
                  <TrendingUpIcon />
                </Avatar>
              }

              title="GLOBAL REFERRAL SHARES"
              subheader={`${props?.globalData?.referrerShares ? props.globalData.referrerShares / 10 ** 9 : 0} rSHRS`}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} >
          <Card style={{ height: "100%" }} variant="outlined" >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="Global Share Price">
                  <TrendingUpIcon />
                </Avatar>
              }

              title="GLOBAL SHARE PRICE"
              subheader={`${props?.globalData?.sharePrice ? props.globalData.sharePrice / 10 ** 9 : 0} WISE`}
            />
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>

  );
}

export default GlobalDataHeader;
