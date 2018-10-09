import React from "react";
import { Router } from "react-static";
import { hot } from "react-hot-loader";
//
import Routes from "react-static-routes";

import "assets/scss/material-kit-pro-react.css?v=1.2.0";

const App = () => (
  <Router>
    <Routes />
  </Router>
);

export default hot(module)(App);
