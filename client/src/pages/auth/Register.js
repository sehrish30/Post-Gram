import { useState } from "react";
import { auth } from "../../firebase.js";
import { toast } from "react-toastify";

import "../../css/register.scss";
import Toast from "../../components/Toast.js";
import Loader from "../../components/Loader.js";
import AuthForm from "../../components/forms/AuthForm.js";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // url where user will be landing from their confirmation mail
    // handleCodeInApp is must true
    const config = {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      handleCodeInApp: true,
    };
    // provide email and then configuration in second argument
    await auth.sendSignInLinkToEmail(email, config);

    // show toast notification to user about email send
    // autoClose false when you dont want to autoclose
    toast(
      `Email is sent to ${email}. Click the link to complete 
                   your registeration`,
      {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        draggablePercent: 60,
      }
    );

    // save user email to localstorage
    localStorage.setItem("emailForRegisteration", email);

    // clear states
    setEmail("");
    setLoading(false);
  };

  return (
    <div className=" p-5 register text-center body">
      {loading ? <Loader loading={loading} /> : <h4>Register</h4>}

      <Toast />

      <AuthForm
        email={email}
        loading={loading}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        name={"Register"}
      />
    </div>
  );
};
export default Register;
