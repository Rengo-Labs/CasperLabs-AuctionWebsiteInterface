import { SnackbarProvider } from "notistack";
import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import AddLiquidity from "../Pages/Users/AddLiquidity";
import HomeScreen from "../Pages/Users/HomeScreen";
import Refer from "../Pages/Users/Refer";
import Staking from "../Pages/Users/Staking";

export const AppContext = createContext({
  activePublicKey: null,
  setActivePublicKey: (activePublicKey) => {},
});

function App() {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  // console.log("path in application: ", activePublicKey);
  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/staking") {
      return <Route component={Staking} />;
    } else if (path === "/refer") {
      return <Route component={Refer} />;
    } else {
      return <Route component={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <AppContext.Provider
        value={{
          activePublicKey,
          setActivePublicKey,
        }}
      >
        <BrowserRouter>
          <Switch>
            <LoginRegisterRedirectCheck exact path="/" />
            <LoginRegisterRedirectCheck exact path="/register" />
            <LoginRegisterRedirectCheck exact path="/marketPlace" />
            <LoginRegisterRedirectCheck exact path="/admin-login" />
            <LoginRegisterRedirectCheck exact path="/login" />

            <Route exact path="/staking" component={Staking} />
            <Route path="/refer" component={Refer} />
            {/* <Route path="/tokens" component={Tokens} />
          <Route path="/pairs" component={Pairs} /> */}
          </Switch>
        </BrowserRouter>
      </AppContext.Provider>
    </SnackbarProvider>
  );
}

export default App;
