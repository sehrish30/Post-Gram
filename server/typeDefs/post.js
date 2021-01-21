// Place all schemas or types here

const { gql } = require("apollo-server-express");

// put types on top and queries down
// exclamation mark to make sure it is not null
// Image type is in auth.js while ID type is from mongo
module.exports = gql`
  # : Post! means we have to return new post created
  # input type let us pass Query variables
  input PostCreateInput {
    content: String!
    image: ImageInput
  }
  input PostUpdateInput {
    _id: String!
    content: String!
    image: ImageInput
  }
  type Post {
    _id: ID!
    content: String!
    image: Image
    postedBy: User
  }
  type Query {
    allPosts(page: Int): [Post!]!
    postsByUser: [Post!]!
    singlePost(postId: String): Post!
    totalPosts: Int!
    search(query: String): [Post]
  }

  type Mutation {
    postCreate(input: PostCreateInput!): Post!
    postUpdate(input: PostUpdateInput!): Post!
    postDelete(postId: String!): Post!
  }
  type Subscription {
    postAdded: Post
    postUpdated: Post
    postDeleted: Post
  }
`;
