// Place all schemas or types here

const { gql } = require("apollo-server-express");

// put types on top and queries down
// exclamation mark to make sure it is not null
// Image type is in auth.js while ID type is from mongo
module.exports = gql`
  type Post {
    _id: ID!
    content: String!
    image: Image
    postedBy: User
  }
  type Query {
    allPosts: [Post!]!
    postsByUser: [Post!]!
  }
  # : Post! means we have to return new post created
  # input type let us pass Query variables
  input PostCreateInput {
    content: String!
    image: ImageInput
  }
  type Mutation {
    postCreate(input: PostCreateInput!): Post!
  }
`;
