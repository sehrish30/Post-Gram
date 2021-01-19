const { gql } = require("apollo-server-express");
const { posts } = require("../temp");
const { authCheck } = require("../helpers/auth");
const Post = require("../models/post");
const User = require("../models/user");

/*--------------------------
       Queries
---------------------------*/

const allPosts = async (parent, args) => {
  return await Post.find({}).exec();
};

const postsByUser = async (parent, args, { req }) => {
  // middleware to check current user authenticity
  // we need to send user token stored in our state in our headers
  // Firebase admin verifies it
  const currentUser = await authCheck(req);

  // Find current user from db
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  // sort by newly created Ones
  return await Post.find({ postedBy: currentUserFromDb })
    .populate("postedBy", "_id username")
    .sort({ createdAt: -1 });
};

/*--------------------------
       Mutation
---------------------------*/

// populate because ref to that particular model
const postCreate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);

  // validation
  if (args.input.content === "") throw new Error("Content is required");

  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  });

  // instantiating new post using post model
  let newPost = await new Post({
    ...args.input,
    postedBy: currentUserFromDb._id,
  })
    .save()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());

  return newPost;
};

module.exports = {
  Query: {
    allPosts,
    postsByUser,
  },
  Mutation: {
    postCreate,
  },
};

/* Mutation example in playground
mutation postCreate($input: PostCreateInput!){
  postCreate(input: $input){
     content
     image {
      url
      public_id
    }
    postedBy{
      username
    }
  }
}
*/
