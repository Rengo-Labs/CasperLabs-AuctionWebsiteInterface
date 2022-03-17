import { SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import AddLiquidity from "../Pages/Users/AddLiquidity";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pairs from "../Pages/Users/Pairs";
import Tokens from "../Pages/Users/Tokens";
import Refer from "../Pages/Users/Refer";
import Staking from "../Pages/Users/Staking";

function App() {
  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/staking") {
      return <Route component={Staking} />;
    } else if (path === "/refer") {
      return <Route component={Refer} />;
    } else if (path === "/tokens") {
      return <Route component={Tokens} />;
    } else if (path === "/pairs") {
      return <Route component={Pairs} />;
    } else {
      return <Route component={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Switch>
          <LoginRegisterRedirectCheck exact path="/" />
          <LoginRegisterRedirectCheck exact path="/register" />
          <LoginRegisterRedirectCheck exact path="/marketPlace" />
          <LoginRegisterRedirectCheck exact path="/admin-login" />
          <LoginRegisterRedirectCheck exact path="/login" />

          <Route exact path="/staking" component={Staking} />
          <Route path="/refer" component={Refer} />
          <Route path="/tokens" component={Tokens} />
          <Route path="/pairs" component={Pairs} />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
