import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./app/containers/App/Application";
import axios from "axios";

if (process.env.REACT_APP_BACKEND_SERVER_ADDRESS)
  axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}`;
else axios.defaults.baseURL = `https://wisegraphqlbackendfinalized-env-1.eba-kecy6vfp.us-east-1.elasticbeanstalk.com/`;


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
serviceWorker.unregister();
