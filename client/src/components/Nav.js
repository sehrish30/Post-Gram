import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { AuthContext } from "../context/auth";

import "../css/Nav.scss";
import Search from "./Search";

const Nav = () => {
  const { state, dispatch } = useContext(AuthContext);
  let history = useHistory();

  const { user } = state;

  const logout = () => {
    auth.signOut();
    dispatch({
      type: "LOGGED_IN_USER",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg nav">
        {/* <!-- Container wrapper --> */}
        <div className="container-fluid">
          {/* <!-- Navbar brand --> */}
          <Link className="navbar-brand" to="/">
            PostGram
          </Link>

          {/* <!-- Toggle button --> */}
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* <!-- Collapsible wrapper --> */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* <!-- Left links --> */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </li>
              {user && (
                <li className="nav-item nav-color">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/profile"
                  >
                    {user?.email.split("@")[0]}
                  </Link>
                </li>
              )}
              {!user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li className="nav-item">
                  <Link to="/login" onClick={logout} className="nav-link">
                    Logout
                  </Link>
                </li>
              )}

              {/* <!-- Navbar dropdown --> */}
            </ul>
            {/* <!-- Search form --> */}
            <Search />
          </div>
          {/* <!-- Collapsible wrapper --> */}
        </div>
        {/* <!-- Container wrapper --> */}
      </nav>
      {/* <!-- Navbar --> */}
    </>
  );
};

export default Nav;
