// Place all schemas or types here

const { gql } = require("apollo-server-express");

// put types on top and queries down
// exclamation mark to make sure it is not null
module.exports = gql`
  type Post {
    id: ID!
    title: String!
    description: String!
  }
  type Query {
    totalPosts: Int!
    allPosts: [Post!]!
  }
  # : Post! means we have to return new post created
  # input type let us pass Query variables
  input PostInput {
    title: String!
    description: String!
  }
  type Mutation {
    newPost(input: PostInput!): Post!
  }
`;
