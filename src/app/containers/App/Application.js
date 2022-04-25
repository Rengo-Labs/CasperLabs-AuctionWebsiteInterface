import { SnackbarProvider } from "notistack";
import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import Refer from "../Pages/Users/Refer";
import Staking from "../Pages/Users/Staking";
import { CookiesProvider } from "react-cookie";

export const AppContext = createContext({
  activePublicKey: null,
  setActivePublicKey: (activePublicKey) => { },
});

function App() {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );

  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/staking") {
      return <Route component={Staking} />;
    } else if (path === "/refer") {
      return <Route component={Refer} />;
    } else if (path === "/home/:user") {
      return <Route component={HomeScreen} />;
    } else {
      return <Route component={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <CookiesProvider>
        <AppContext.Provider
          value={{
            activePublicKey,
            setActivePublicKey,
          }}
        >
          <BrowserRouter>
            <Switch>
              <Route exact path="/staking" component={Staking} />
              <Route exact path="/refer" component={Refer} />
              <Route exact path="/home/:user" component={HomeScreen} />
              <Route exact path="/home" component={HomeScreen} />
              {/* <LoginRegisterRedirectCheck exact path="/:user" /> */}
              <LoginRegisterRedirectCheck exact path="/" />
            </Switch>
          </BrowserRouter>
        </AppContext.Provider>
      </CookiesProvider>
    </SnackbarProvider>
  );
}

export default App;
