import React, { useState, useEffect, useContext } from "react";

import { Route, Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import Loader from "./Loader";

const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(AuthContext);
  // by default user isnot available
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (state.user) {
      setUser(true);
    }
  }, [state.user]);

  const navLinks = () => (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/password/update">
            Password
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/post/create">
            Post
          </Link>
        </li>
      </ul>
    </nav>
  );

  const renderContent = () => (
    <div className="container-fluid pt-5">
      <div className="row">
        <div className="col-md-4">{navLinks()}</div>

        {/* Update contents dynamically when user goes 
        on this route update particular component */}
        <div className="col-md-8">
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
