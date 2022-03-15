import { SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import AddLiquidity from "../Pages/Users/AddLiquidity";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pairs from "../Pages/Users/Pairs";
import Pool from "../Pages/Users/Pool";
// import RemoveLiquidity from "../Pages/Users/RemoveLiquidity";
// import Swap from "../Pages/Users/Swap";
import Tokens from "../Pages/Users/Tokens";
import Refer from "../Pages/Users/Refer";

function App() {
  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/pool") {
      return <Route component={Pool} />;
      // } else if (path === "/pool/addLiquidity") {
      //   return <Route component={AddLiquidity} />;
      // } else if (path === "/pool/removeLiquidity") {
      //   return <Route component={RemoveLiquidity} />;
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
          {/* <LoginRegisterRedirectCheck exact path="/login" /> */}
          <LoginRegisterRedirectCheck exact path="/register" />
          <LoginRegisterRedirectCheck exact path="/marketPlace" />
          <LoginRegisterRedirectCheck exact path="/admin-login" />
          <LoginRegisterRedirectCheck exact path="/login" />
          {/* <LoginRegisterRedirectCheck exact path="/" /> */}

          <Route exact path="/pool" component={Pool} />
          {/* <Route exact path="/refer" component={Refer} /> */}
          {/* <Route
            exact
            path="/pool/removeLiquidity/:tokenAAddress/:tokenBAddress"
            component={RemoveLiquidity}
          /> */}
          <Route path="/refer" component={Refer} />
          <Route path="/tokens" component={Tokens} />
          <Route path="/pairs" component={Pairs} />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
