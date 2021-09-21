import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

export default function Landing() {
  const history = useHistory();
  const firebaseConfig = {
    apiKey: "AIzaSyDRlKpi-tU5xOl_O5rYEIh815540FPCvBw",
    authDomain: "diplomski-50bd0.firebaseapp.com",
    projectId: "diplomski-50bd0",
    storageBucket: "diplomski-50bd0.appspot.com",
    messagingSenderId: "257513941576",
    appId: "1:257513941576:web:499ac5c46cf9a23313067d",
    measurementId: "G-K0VWH1Z3BV",
  };

  useEffect(() => {}, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          width: "30vw",
        }}
      >
        <h3 onClick={() => history.push("/login")}>Login</h3>
        <h3 onClick={() => history.push("/login/register")}>Register</h3>
      </div>
      <br />
      <br />
      <br />

      <Switch>
        <Route
          path="/login"
          exact
          render={(props) => (
            <Login {...props} firebaseConfig={firebaseConfig} />
          )}
        />
        <Route
          path="/login/register"
          exact
          render={(props) => (
            <Register {...props} firebaseConfig={firebaseConfig} />
          )}
        />
      </Switch>
    </div>
  );
}
