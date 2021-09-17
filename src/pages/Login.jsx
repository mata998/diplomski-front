import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { getFingerprint, serverURL } from "../utils/Utils";
import axios from "axios";

import { initializeApp, getApps } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function Login({ firebaseConfig, init }) {
  const { user, setUser, loggedIn, setLoggedIn, fbInitialized } =
    useContext(GlobalContext);

  const [googleLogedIn, setGoogleLogedIn] = useState(false);
  const [uid, setUid] = useState("");
  const [failMsg, setFailMsg] = useState("");

  useEffect(() => {
    console.log("????");

    initializeApp(firebaseConfig);

    const auth = getAuth();

    getRedirectResult(auth)
      .then((result) => {
        const user = result.user;
        console.log(user);

        const data = {
          userId: user.uid,
          fingerprint: JSON.stringify(getFingerprint()),
        };

        login(data);
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error.message);
      });
  }, []);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect(auth, provider);
  };

  const login = async (data) => {
    const res = await axios.post(`${serverURL()}/api/login`, data);

    console.log(res);

    if (res.data.success) {
      setUser(res.data.data);
      setLoggedIn(true);
      setFailMsg("");
    } else {
      setFailMsg("Los login");
    }
  };

  const logout = () => {
    window.location.reload();
  };

  return (
    <div>
      {!loggedIn ? (
        <>
          <p>{failMsg}</p>
          <button style={{ padding: "15px" }} onClick={googleLogin}>
            Login
          </button>
        </>
      ) : (
        <>
          <h3>Poy {user.name}</h3>
          <button style={{ padding: "15px" }} onClick={logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
