const ValidateRegisteration = ({ email, password }) => {
  let errors = {};

  //Email Errors
  if (!email) {
    errors.email = "Your email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = "Your email is invalid";
  }

  // Password Errors
  if (!password) {
    errors.password = "Your password is required";
  } else if (password.length < 6) {
    errors.password = "Your password must be at least 6 characters";
  }

  return errors;
};

export default ValidateRegisteration;
