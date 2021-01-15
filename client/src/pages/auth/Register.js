import { useState } from "react";
import "../../css/register.scss";

const handleSubmit = () => {};

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className=" p-5 register text-center body">
      <h4>Register</h4>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
export default Register;
