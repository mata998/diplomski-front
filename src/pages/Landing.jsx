import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

import { GlobalContext } from "../context/GlobalContext";

import { serverURL } from "../utils/Utils";
import axios from "axios";

import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function Landing() {
  const history = useHistory();
  const { user, setUser, fbInitialized, setFbInitialized } =
    useContext(GlobalContext);

  const [firebase, setFirebase] = useState({});
  const [init, setInit] = useState(false);
  const [googleLogedIn, setGoogleLogedIn] = useState(false);
  const [loginRegister, setLoginRegister] = useState(false);
  const [mail, setMail] = useState("");
  const [uid, setUid] = useState("");
  const [inputName, setInputName] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyDRlKpi-tU5xOl_O5rYEIh815540FPCvBw",
    authDomain: "diplomski-50bd0.firebaseapp.com",
    projectId: "diplomski-50bd0",
    storageBucket: "diplomski-50bd0.appspot.com",
    messagingSenderId: "257513941576",
    appId: "1:257513941576:web:499ac5c46cf9a23313067d",
    measurementId: "G-K0VWH1Z3BV",
  };

  useEffect(() => {
    console.log("landing uef");
  }, []);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect(auth, provider);
  };

  // gpu platform cores ram display
  const getFingerprint = () => {
    const fingerprint = {
      gpu: getGPU(),
      ram: navigator.deviceMemory,
      cores: navigator.hardwareConcurrency,
      platform: navigator.platform,
      screen: `[${window.screen.height}, ${window.screen.width}]`,
      pixelDepth: window.screen.pixelDepth,
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation.type,
      userAgent: navigator.userAgent,
      mobile: navigator.userAgentData.mobile,
    };

    console.log({ a: JSON.stringify(fingerprint) });
    return fingerprint;
  };

  const getGPU = () => {
    const gl = document.createElement("canvas").getContext("webgl");

    if (!gl) {
      return "GPU error";
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    if (debugInfo) {
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    return {
      error: "GPU error",
    };
  };

  const register = async () => {
    if (!googleLogedIn || inputName == "") {
      alert("Ne moze tako");
      return;
    }

    const data = {
      uid: uid,
      name: inputName,
      mail: mail,
      fingerprint: JSON.stringify(getFingerprint()),
    };

    const res = await axios.post(`${serverURL()}/api/login/register`, data);
    console.log(res);
  };

  const login = async () => {
    googleLogin();

    const data = {
      userId: uid,
      fingerprint: JSON.stringify(getFingerprint()),
    };
    const res = await axios.post(`${serverURL()}/api/login`, data);

    console.log(res.data);
    setUser(res.data);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          width: "50vw",
        }}
      >
        <h3 onClick={() => history.push("/login/register")}>Register</h3>
        <h3 onClick={() => history.push("/login")}>Login</h3>
      </div>
      <br />
      <br />
      <br />

      <Switch>
        <Route
          path="/login/register"
          exact
          render={(props) => (
            <Register {...props} firebaseConfig={firebaseConfig} />
          )}
        />
        <Route
          path="/login"
          exact
          render={(props) => (
            <Login {...props} firebaseConfig={firebaseConfig} init={init} />
          )}
        />
      </Switch>

      {!loginRegister ? (
        <></>
      ) : (
        <>
          <button style={{ padding: "15px" }} onClick={login}>
            Login
          </button>
        </>
      )}
    </div>
  );
}
