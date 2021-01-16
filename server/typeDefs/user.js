const { gql } = require("apollo-server-express");

// ! means it shoudn't be null
// resolver for this is in auth.js
module.exports = gql`
  type UserCreateResponse {
    username: String!
    email: String!
  }
  type Mutation {
    userCreate: UserCreateResponse!
  }
`;
