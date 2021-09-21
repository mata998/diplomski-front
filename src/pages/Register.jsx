import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { GlobalContext } from "../context/GlobalContext";
import { getFingerprint, serverURL } from "../utils/utils";
import axios from "axios";

import { initializeApp, getApps } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function Register({ firebaseConfig }) {
  const { user, setUser, fbInitialized } = useContext(GlobalContext);
  const history = useHistory();

  const [googleLogedIn, setGoogleLogedIn] = useState(false);

  const [mail, setMail] = useState("");
  const [uid, setUid] = useState("");
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    initializeApp(firebaseConfig);

    const auth = getAuth();

    getRedirectResult(auth)
      .then((result) => {
        console.log(result);
        console.log("Desio se redirect");
        const user = result.user;
        console.log(user);

        setUid(user.uid);
        setMail(user.email);
        setGoogleLogedIn(true);
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

    if (res.data.success) {
      console.log("Uspesan register");
      console.log(res.data.data);

      history.push("/login");
    } else {
      console.log("Neuspesan register");
      console.log(res.data.err);
      alert("Neuspesan register");
    }
  };

  return (
    <>
      <div>Mail: </div>
      {googleLogedIn ? (
        <span>{mail}</span>
      ) : (
        <button style={{ padding: "5px" }} onClick={googleLogin}>
          Google nalog
        </button>
      )}

      <br />
      <br />

      <div>Ime: </div>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        style={{ padding: "5px" }}
      />

      <br />
      <br />

      <button style={{ padding: "15px" }} onClick={register}>
        Register
      </button>
    </>
  );
}
