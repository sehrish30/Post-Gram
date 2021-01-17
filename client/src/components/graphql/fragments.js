import { gql } from "@apollo/client";

// on then gives this fragment belongs to which type here it is User type
// because User model
export const USER_INFO = gql`
  fragment userInfo on User {
    _id
    name
    username
    email
    images {
      url
      public_id
    }
    about
    createdAt
    updatedAt
  }
`;
