import PropagateLoader from "react-spinners/PropagateLoader";
import React, { useState } from "react";
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #16c79a;
`;

const Loader = ({ loading }) => {
  const [color] = useState("#16c79a");
  return (
    <PropagateLoader color={color} loading={loading} css={override} size={15} />
  );
};

export default Loader;
