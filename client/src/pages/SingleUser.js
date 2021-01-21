import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

import "../css/SingleUser.scss";
import UserCard from "../components/UserCard";

const PUBLIC_PROFILE = gql`
  query publicProfile($username: String!) {
    publicProfile(username: $username) {
      _id
      username
      name
      email
      images {
        url
        public_id
      }
      about
    }
  }
`;

const SingleUser = () => {
  let params = useParams();
  let show = true;
  let { username } = params;

  const { loading, data } = useQuery(PUBLIC_PROFILE, {
    variables: { username: username },
  });
  // console.log(data?.publicProfile);
  if (loading)
    return (
      <div className="pt-4 container text-center load">
        <Loader />
      </div>
    );
  return (
    <div className="container load text-center main-card">
      <div className="row">
        <div className="col-lg">
          <UserCard
            key={data.publicProfile._id}
            user={data.publicProfile}
            show={show}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
