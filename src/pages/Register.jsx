import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getFingerprint, serverURL } from "../utils/utils";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

export default function Register({ uid, mail }) {
  const { user, setUser, loggedIn, setLoggedIn, setRegistered } =
    useContext(GlobalContext);

  const [inputName, setInputName] = useState("");
  const history = useHistory();

  const register = async () => {
    if (inputName == "" || uid == "") {
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
      console.log(res.data);

      setRegistered(true);
      history.push("/");
    } else {
      console.log("Neuspesan register");
      console.log(res.data.err);
      alert("Neuspesan register");
    }
  };

  return (
    <>
      <div>Register</div>

      <br />
      <br />

      <div>Mail: {mail}</div>

      <br />

      <div>Ime: </div>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
      />

      <br />

      <button style={{ padding: "15px" }} onClick={register}>
        Register
      </button>
    </>
  );
}
