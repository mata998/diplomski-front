import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useHistory } from "react-router";
import { Link, Switch, Route } from "react-router-dom";
import { serverURL } from "../utils/utils";
import axios from "axios";
import AdminAllCourses from "../admin-components/AdminAllCourses";
import AdminCreateCourse from "../admin-components/AdminCreateCourse.jsx";
import AdminAllUsers from "../admin-components/AdminAllUsers.jsx";
import AdminAllCreators from "../admin-components/AdminAllCreators.jsx";
import AdminCourse from "../admin-components/AdminCourse";
import AdminRequests from "../admin-components/AdminRequests";

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
            Courses
          </Link>
          <Link className="nav-link" to="/admin/requests">
            Requests
          </Link>
          <Link className="nav-link" to="/admin/users">
            Users
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
          path={"/admin/requests"}
          exact
          render={(props) => <AdminRequests {...props} />}
        />
        <Route
          path={"/admin/users"}
          exact
          render={(props) => <AdminAllUsers {...props} />}
        />
        <Route
          path={"/admin/course/:courseId"}
          exact
          render={(props) => <AdminCourse {...props} />}
        />
      </Switch>
    </>
  );
}
