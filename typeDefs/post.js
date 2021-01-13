// Place all schemas or types here

const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    totalPosts: Int!
  }
`;
