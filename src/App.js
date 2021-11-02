// Css
import "./App.css";

import { useState, useEffect, useContext, useRef } from "react";
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
  const refreshIntervalId = useRef(null);

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
    initializeApp(firebaseConfig);

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

        const loginToken = localStorage.getItem("loginToken");
        if (loginToken) {
          login("autologin", { loginToken });
        }
      });
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
        fingerprint: getFingerprint(),
      };

      res = await axios.post(`${serverURL()}/api/login/autologin`, loginData);
    }

    if (type === "login") {
      const loginData = {
        userId: user.uid,
        fingerprint: getFingerprint(),
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

      // start refreshtoken interval
      refreshTokenStart();

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
      localStorage.removeItem("loginToken");

      console.log("los fingerprint");
      if (type === "login") {
        alert("Los fingerprint");
      }
    }
    // error
    else {
      new Cookies().remove("token");
      localStorage.removeItem("loginToken");
      console.log(res);
    }
  };

  const logout = async () => {
    new Cookies().remove("token");
    localStorage.removeItem("loginToken");

    refreshTokenStop();

    setUser({});
    setLoggedIn(false);

    history.push("/");
  };

  const refreshTokenStart = () => {
    const refreshMinutes = 5;

    const id = setInterval(async () => {
      const res = await axios.post(
        `${serverURL()}/api/login/refresh-token`,
        { fingerprint: getFingerprint() },
        { withCredentials: true }
      );

      if (res.data.success) {
        console.log(res.data);

        new Cookies().set("token", res.data.data);
      } else {
        console.log(res.data);

        alert("Refreshing token failed");

        logout();
      }
    }, refreshMinutes * 60 * 1000);

    refreshIntervalId.current = id;
  };

  const refreshTokenStop = () => {
    clearInterval(refreshIntervalId.current);
    refreshIntervalId.current = null;
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
