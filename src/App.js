// Css
import "./App.css";

import { useState, useEffect, useContext } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { GlobalContext } from "./context/GlobalContext.js";

import { initializeApp } from "firebase/app";

import Course from "./pages/Course.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import MyCourses from "./pages/MyCourses.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";

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
  const location = useLocation();

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
    if (!loggedIn) {
      initializeApp(firebaseConfig);

      const loginToken = localStorage.getItem("loginToken");

      if (loginToken) {
        login("autologin", { loginToken });
      } else {
        const auth = getAuth();

        getRedirectResult(auth)
          .then((result) => {
            const user = result.user;
            console.log(user);

            login("login", { user });
          })
          .catch((error) => {
            // Handle Errors here.
            new Cookies().remove("token");

            console.log("error u redirectu");
            console.log(error);
          });
      }
    }
  }, [registered]);

  useEffect(() => {
    if (user.role === "admin" && location.pathname === "/") {
      history.push("/admin/courses");
    }
  }, [user]);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect(auth, provider);
  };

  const login = async (type, payload) => {
    let { user, loginToken } = payload;

    let res;

    if (type === "autologin") {
      const loginData = {
        loginToken,
        fingerprint: JSON.stringify(getFingerprint()),
      };

      res = await axios.post(`${serverURL()}/api/login/autologin`, loginData);
    }

    if (type === "login") {
      const loginData = {
        userId: user.uid,
        fingerprint: JSON.stringify(getFingerprint()),
      };

      res = await axios.post(`${serverURL()}/api/login`, loginData);
    }

    // login
    if (res.data.case === "login") {
      const userInfo = res.data.data;

      // token in cookie
      new Cookies().set("token", userInfo.token);
      console.log(userInfo);

      // loginToken in localStorage
      localStorage.setItem("loginToken", userInfo.loginToken);

      // global state
      setUser(userInfo);
      setLoggedIn(true);

      // redirect to admin page happenes
      // in useEffect on setUser
    }
    // register
    else if (res.data.case === "register") {
      console.log("treba register");

      setUid(user.uid);
      setMail(user.email);
      history.push(`/register`);
    }
    // bad fingerprint
    else if (res.data.case === "fingerprint") {
      new Cookies().remove("token");
      alert("Los fingerprint");
      console.log("los fingerprint");
    }
    // error
    else {
      new Cookies().remove("token");
      console.log(res);
    }
  };

  const logout = async () => {
    const loginToken = localStorage.getItem("loginToken");

    const res = await axios.post(`${serverURL()}/api/login/logout`, {
      loginToken,
    });

    new Cookies().remove("token");
    localStorage.removeItem("loginToken");

    setUser({});
    setLoggedIn(false);
    setRegistered(false);

    history.push("/");
  };

  return (
    <div className="App">
      <Navbar googleLogin={googleLogin} logout={logout} />
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
