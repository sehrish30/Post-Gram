import React, { useState, useEffect, useContext } from "react";

import { Route, Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import Loader from "./Loader";
import "../css/PrivateRoute.scss";
import { useLocation } from "react-router-dom";
import classNames from "classnames";

const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(AuthContext);
  // by default user isnot available
  const [user, setUser] = useState(false);
  let location = useLocation();

  useEffect(() => {
    if (state.user) {
      setUser(true);
    }
  }, [state.user]);

  if (location.pathname === "/post/create") {
    console.log(location.pathname);
  }

  /* DYNAMIC CLASSES */
  const ProfileLink = classNames({
    "nav-link": true,
    "active-nav": location.pathname === "/profile",
  });
  const postLink = classNames({
    "nav-link": true,
    "active-password": location.pathname === "/post/create",
  });
  const updateLink = classNames({
    "nav-link": true,
    "active-post": location.pathname === "/password/update" ? true : false,
  });

  const navLinks = () => (
    <nav className="ml-0">
      <ul className="nav flex-column side-nav">
        <li>
          <Link className={ProfileLink} aria-current="page" to="/profile">
            Profile
          </Link>
        </li>
        <li>
          <Link
            className={updateLink}
            aria-current="page"
            to="/password/update"
          >
            Password
          </Link>
        </li>
        <li>
          <Link className={postLink} aria-current="page" to="/post/create">
            Post
          </Link>
        </li>
      </ul>
    </nav>
  );

  const renderContent = () => (
    <div className="container-fluid p-0 ">
      <div className="row">
        <div className="col-md-3 p-0 side">{navLinks()}</div>

        {/* Update contents dynamically when user goes 
        on this route update particular component */}
        <div className="col-md-9">
          <Route {...rest} />
        </div>
      </div>
    </div>
  );

  return user ? (
    renderContent()
  ) : (
    <div className="text-center mt-4">
      <Loader />
    </div>
  );
};

export default PrivateRoute;
