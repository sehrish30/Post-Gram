// Place all schemas or types here
const { gql } = require("apollo-server-express");

module.exports = gql`
  #scalar type
  scalar DateTime
  type Image {
    url: String
    public_id: String
  }
  type User {
    _id: ID!
    username: String
    name: String
    email: String
    images: [Image]
    about: String
    createdAt: DateTime
    updatedAt: DateTime
  }
  # custom type
  type UserCreateResponse {
    username: String!
    email: String!
  }
  # input type
  input ImageInput {
    url: String
    public_id: String
  }
  # input type
  input UserUpdateInput {
    username: String
    name: String
    images: [ImageInput]
    about: String
    email: String!
  }
  type Query {
    profile: User!
  }
  type Mutation {
    userCreate: UserCreateResponse!
    userUpdate(input: UserUpdateInput): User!
  }
`;
