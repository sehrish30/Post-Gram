import React, { useState } from "react";

const useFormValidation = (values, validate) => {
  let errors = {};

  const handleSubmitErrors = () => {
    const validationErrors = validate(values);
    console.log(validationErrors);
    errors = validationErrors;
    return errors;
  };

  return { handleSubmitErrors };
};

export default useFormValidation;
