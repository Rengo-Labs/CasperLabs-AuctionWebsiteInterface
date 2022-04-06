import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./app/containers/App/Application";
import axios from "axios";

if (process.env.REACT_APP_BACKEND_SERVER_ADDRESS)
  axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}`;
else axios.defaults.baseURL = `https://wise-graphql-backend.herokuapp.com/`;

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
