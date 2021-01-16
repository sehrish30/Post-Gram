import { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";

const PasswordForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // url where user will be landing from their confirmation mail
    // handleCodeInApp is must true
    const config = {
      url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast(`Email is sent to ${email}. Click the link to change Password`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 3000,
          draggablePercent: 60,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div className="container p-5">
      {loading ? <Loader /> : <h1>Forgot Password</h1>}
      <Toast />
      <AuthForm
        email={email}
        setEmail={setEmail}
        loading={loading}
        handleSubmit={handleSubmit}
        name="Send"
      />
    </div>
  );
};

export default PasswordForgot;
