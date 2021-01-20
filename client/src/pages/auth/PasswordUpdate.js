import { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";

import { useHistory } from "react-router-dom";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        toast(`Password successfully updated`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 3000,
          draggablePercent: 60,
        });
        setLoading(false);
        setPassword("");
        history.push("/profile");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <div className="container p-5">
      <Toast />
      <div className="container profile py-4">
        {loading ? (
          <Loader />
        ) : (
          <h1 className="createpost-heading">Password update</h1>
        )}
        <div className="col-md-10 px-5">
          <AuthForm
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSubmit={handleSubmit}
            name="Update"
            showPasswordInput={true}
            hideEmailInput={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;
