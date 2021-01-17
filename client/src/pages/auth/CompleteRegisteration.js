import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ValidateRegisteration from "../../components/validations/ValidateRegisteration.js";
import { USER_CREATE } from "../../components/graphql/mutations";

// Firebase
import { auth } from "../../firebase";

// Hooks
import useFormValidation from "../../hooks/useFormValidation";

// Context
import { AuthContext } from "../../context/auth";

// Components
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";

// Mutations
import { useMutation } from "@apollo/client";
import AuthForm from "../../components/forms/AuthForm.js";

const CompleteRegisteration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  let history = useHistory();
  // Grab user email from localStorage and populate
  useEffect(() => {
    setEmail(localStorage.getItem("emailForRegisteration"));
  }, [history]);

  // Mutation
  const [userCreate] = useMutation(USER_CREATE);

  // Validation
  const { handleSubmitErrors } = useFormValidation(
    { email, password },
    ValidateRegisteration
  );

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    // invoking a func in useFormValidation hook once form is submitted and get errors
    let errors;
    errors = handleSubmitErrors();

    if (Object.values(errors).length >= 1) {
      toast.error(Object.values(errors).join(" "), {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        draggablePercent: 60,
      });
      console.log(Object.values(errors).join(" "));
      setLoading(false);
      return;
    }

    try {
      // signInWithEmail verify user is with email and correct url
      // current url from window location ref statement
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      setLoading(false);

      if (result.user.emailVerified) {
        // remove email from localStorage
        localStorage.removeItem("emailForRegisteration");

        // auth gives us access to user mail
        let user = auth.currentUser;

        // save user password in auth state to login
        await user.updatePassword(password);

        // dispatch user with token and email
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
        history.push("/");

        //MAKE API req to save user in mongodb
        userCreate();
      }

      toast(`Successfully Registered`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        draggablePercent: 60,
      });
    } catch (err) {
      console.log("registeration Complete Error", err.message);
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className=" p-5 register text-center body">
      {loading ? <Loader loading={loading} /> : <h4>Complete Registeration</h4>}

      <Toast />

      <AuthForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        showPasswordInput={true}
        name="Login"
        loading={loading}
        handleSubmit={handleSubmit}
        disable={true}
      />
    </div>
  );
};

export default CompleteRegisteration;
