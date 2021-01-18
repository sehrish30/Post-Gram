import React, { useState, useEffect, useContext } from "react";

import { Route, Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

import { useLocation, useHistory } from "react-router-dom";
import classNames from "classnames";
import LoadingToRedirect from "./LoadingToRedirect";

// This component protect logged in user from preventing him to access
// login and register routes
const PublicRoute = ({ ...rest }) => {
  const { state } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (state.user) {
      history.push("/profile");
    }
  }, [state.user]);
  return (
    <div className="container-fluid p-5">
      <Route {...rest} />
    </div>
  );
};

export default PublicRoute;
