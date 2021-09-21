import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { getFingerprint, serverURL } from "../utils/utils";
import axios from "axios";
import Cookies from "universal-cookie";

import { initializeApp } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function Login({ firebaseConfig }) {
  const { user, setUser, loggedIn, setLoggedIn } = useContext(GlobalContext);

  const [failMsg, setFailMsg] = useState("");

  useEffect(() => {
    if (!loggedIn) {
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
          console.log("error u redirectu");
          console.log(error.message);
        });
    }
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
      const cookies = new Cookies();
      cookies.set("token", res.data.data.token);

      console.log(cookies);

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
