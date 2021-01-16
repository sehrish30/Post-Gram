import { useState, useContext } from "react";
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import AuthForm from "../../components/forms/AuthForm.js";

// Mutations
import { gql, useMutation } from "@apollo/client";

import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";

// Context
import { AuthContext } from "../../context/auth";

// firebase
import { auth, googleAuthProvider, facebookAuthProvider } from "../../firebase";

import "../../css/register.scss";

const Login = () => {
  const { dispatch } = useContext(AuthContext);

  const USER_CREATE = gql`
    mutation userCreate {
      userCreate {
        username
        email
      }
    }
  `;

  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Mutation
  const [userCreate] = useMutation(USER_CREATE);

  const updateContext = async (result) => {
    const { user } = result;
    const idTokenResult = await user.getIdTokenResult();

    // Log the user then update in the state
    dispatch({
      type: "LOGGED_IN_USER",
      payload: { email: user.email, token: idTokenResult.token },
    });

    // send user info to our server to either update or create user
    userCreate();
    history.push("/");
  };

  const googleLogin = () => {
    auth.signInWithPopup(googleAuthProvider).then(async (result) => {
      updateContext(result);
    });
  };
  const facebookLogin = () => {
    auth.signInWithPopup(facebookAuthProvider).then(async (result) => {
      updateContext(result);
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          // Update Context
          updateContext(result);
        });

      history.push("/");
    } catch (err) {
      console.log("Login error", err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className=" p-5 register text-center body">
      <Toast />
      <div className="row">
        <div className="col-md-8">
          <AuthForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            showPasswordInput={true}
            name="Login"
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="col-md-4 mt-4">
          <FacebookLoginButton size="40px" onClick={facebookLogin} />
          <GoogleLoginButton size="40px" onClick={googleLogin} />
        </div>
      </div>
      <div className="row text-center">
        {loading ? <Loader loading={loading} /> : null}
      </div>
      <div className="row background mt-4">
        <div className="col-md-12">
          <img
            className="background-img"
            src={"../../../watery.png"}
            alt="watery background"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
