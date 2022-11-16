import { SnackbarProvider } from "notistack";
import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import Refer from "../Pages/Users/Refer";
import Staking from "../Pages/Users/Staking";
import { CookiesProvider } from "react-cookie";
import Reservation from "../Pages/Users/Reservation";
import { Buffer } from 'buffer';


export const AppContext = createContext({
  activePublicKey: null,
  setActivePublicKey: (activePublicKey) => { },
});

function App() {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  window.Buffer = Buffer;

  // const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
  //   if (path === "/staking") {
  //     return <Route component={Staking} />;
  //   } else if (path === "/refer") {
  //     return <Route component={Refer} />;
  //   } else if (path === "/reservation") {
  //     return <Route component={Reservation} />;
  //   } else if (path === "/home/:refree") {
  //     return <Route component={HomeScreen} />;
  //   } else {
  //     return <Route component={HomeScreen} />;
  //   }
  // };

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
            <Routes>
              <Route exact path="/staking" element={<Staking/>} />
              <Route exact path="/refer" element={<Refer/>} />
              <Route exact path="/reservation" element={<Reservation/>} />
              <Route exact path="/home/:refree" element={<HomeScreen/>} />
              <Route exact path="/home" element={<HomeScreen/>} />
              <Route exact path="/" element={<HomeScreen/>} />
              {/* <LoginRegisterRedirectCheck exact path="/:user" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/" /> */}
            </Routes>
          </BrowserRouter>
        </AppContext.Provider>
      </CookiesProvider>
    </SnackbarProvider>
  );
}

export default App;
