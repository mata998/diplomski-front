import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

export default function Navbar({ googleLogin, logout }) {
  const { user, loggedIn } = useContext(GlobalContext);

  return (
    <div className={`navbar`}>
      <ul className="nav-links">
        <Link className="nav-link" to="/">
          Courses
        </Link>

        {loggedIn ? (
          <>
            <Link className="nav-link" to="/my-courses">
              My courses
            </Link>
            {user.role === "admin" && (
              <Link className="nav-link" to="/admin/courses">
                Admin
              </Link>
            )}
            <div className="nav-link">{user.name} </div>
            <div className="nav-link" onClick={logout}>
              Logout
            </div>
          </>
        ) : (
          <div className="nav-link" onClick={googleLogin}>
            Login
          </div>
        )}
      </ul>
    </div>
  );
}
