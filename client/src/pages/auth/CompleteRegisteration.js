import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ValidateRegisteration from "../../components/validations/ValidateRegisteration.js";

// Firebase
import { auth } from "../../firebase";

// Hooks
import useFormValidation from "../../hooks/useFormValidation";

// Context
import { AuthContext } from "../../context/auth";

// Components
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";

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
        //**MAKE API req to save user in mongodb **/
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
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="text-center">
          <button className="mt-4 box text-center" disabled={!email || loading}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteRegisteration;
