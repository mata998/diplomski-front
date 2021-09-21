// Css
import "./App.css";

import { useState, useEffect, useContext } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Course from "./pages/Course.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import MyCourses from "./pages/MyCourses.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import { GlobalProvider, GlobalContext } from "./context/GlobalContext.js";

import { initializeApp } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { getFingerprint, serverURL } from "./utils/utils";
import axios from "axios";
import Cookies from "universal-cookie";

function App() {
  const { user, setUser, loggedIn, setLoggedIn, registered, setRegistered } =
    useContext(GlobalContext);
  const history = useHistory();
  const [uid, setUid] = useState("");
  const [mail, setMail] = useState("Na stranicu dodjite klikom na Login");

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
    console.log("Desava se uef app.js");
    if (!loggedIn) {
      initializeApp(firebaseConfig);

      const auth = getAuth();

      getRedirectResult(auth)
        .then((result) => {
          const user = result.user;
          console.log(user);

          login(user);
        })
        .catch((error) => {
          // Handle Errors here.
          console.log("error u redirectu");
          console.log(error.message);
        });
    }
  }, [registered]);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect(auth, provider);
  };

  const login = async (user) => {
    const loginData = {
      userId: user.uid,
      fingerprint: JSON.stringify(getFingerprint()),
    };

    const res = await axios.post(`${serverURL()}/api/login`, loginData);

    // login
    if (res.data.case == "login") {
      const cookies = new Cookies();
      cookies.set("token", res.data.data.token);

      console.log(res.data.data);

      setUser(res.data.data);
      setLoggedIn(true);
    }
    // register
    else if (res.data.case == "register") {
      console.log("treba register");

      setUid(user.uid);
      setMail(user.email);
      history.push(`/register`);
    }
    // bad fingerprint
    else if (res.data.case == "fingerprint") {
      alert("Los fingerprint");
      console.log("los fingerprint");
    }
    // error
    else {
      console.log(res);
    }
  };

  return (
    <div className="App">
      <Navbar googleLogin={googleLogin} />
      <Switch>
        <Route path={"/"} exact render={(props) => <Landing {...props} />} />
        <Route
          path={"/register"}
          exact
          render={(props) => <Register {...props} uid={uid} mail={mail} />}
        />
        <Route
          path={"/my-courses"}
          exact
          render={(props) => <MyCourses {...props} />}
        />
        <Route
          path="/course/:courseId"
          exact
          render={(props) => <Course {...props} />}
        />
        <Route path="/admin" render={(props) => <Admin {...props} />} />
      </Switch>
    </div>
  );
}

export default App;
