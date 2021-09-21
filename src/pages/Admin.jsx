import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useHistory } from "react-router";
import { Link, Switch, Route } from "react-router-dom";
import { serverURL } from "../utils/utils";
import AdminAllCourses from "../components/AdminAllCourses.jsx";
import AdminCreateCourse from "../components/AdminCreateCourse.jsx";
import AdminAllUsers from "../components/AdminAllUsers.jsx";
import AdminAllCreators from "../components/AdminAllCreators.jsx";

import axios from "axios";

export default function Admin() {
  const { loggedIn } = useContext(GlobalContext);

  const history = useHistory();

  useEffect(() => {
    isAdmin();
  }, []);

  const isAdmin = async () => {
    if (!loggedIn) {
      history.push("/");
    }

    const res = await axios.get(`${serverURL()}/api/admin/isadmin`, {
      withCredentials: true,
    });

    console.log(res);

    if (res.data.success == false) {
      history.push("/");
    }
  };

  return (
    <>
      <div>
        <h3>Admin</h3>
      </div>

      <div className="navbar">
        <ul className="nav-links">
          <Link className="nav-link" to="/admin/courses">
            All courses
          </Link>
          <Link className="nav-link" to="/admin/create-course">
            New course
          </Link>
          <Link className="nav-link" to="/admin/users">
            Users
          </Link>
          <Link className="nav-link" to="/admin/creators">
            Creators
          </Link>
        </ul>
      </div>

      <Switch>
        <Route
          path={"/admin/courses"}
          exact
          render={(props) => <AdminAllCourses {...props} />}
        />
        <Route
          path={"/admin/create-course"}
          exact
          render={(props) => <AdminCreateCourse {...props} />}
        />
        <Route
          path={"/admin/users"}
          exact
          render={(props) => <AdminAllUsers {...props} />}
        />
        <Route
          path={"/admin/creators"}
          exact
          render={(props) => <AdminAllCreators {...props} />}
        />
      </Switch>
    </>
  );
}
