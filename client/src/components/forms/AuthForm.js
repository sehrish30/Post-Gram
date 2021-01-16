import React from "react";

const AuthForm = ({
  email,
  password,
  loading,
  setEmail = "",
  setPassword,
  handleSubmit,
  showPasswordInput = false,
  name,
  disable,
  hideEmailInput = false,
}) => {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        {disable ? (
          <>
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </>
        ) : (
          !hideEmailInput && (
            <>
              <label>Email Address</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </>
          )
        )}
      </div>
      {showPasswordInput && (
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
      )}
      <div className="text-center">
        <button className="mt-4 mb-4 box text-center" disabled={loading}>
          {name}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
