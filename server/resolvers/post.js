const { gql } = require("apollo-server-express");
const { posts } = require("../temp");
const { authCheck } = require("../helpers/auth");
const Post = require("../models/post");
const User = require("../models/user");

/*--------------------------
       Queries
---------------------------*/

const allPosts = async (parent, args) => {
  return await Post.find({})
    .populate("postedBy", "username _id")
    .sort({ createdAt: -1 })
    .exec();
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

const postUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);

  // Validation
  if (args.input.content.trim() === "") throw new Error("Content is required");

  // get current user mongodb based on email
  const currrentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  // _id of post to update
  const postToUpdate = await Post.findOne({ _id: args.input._id }).exec();

  // if currentUser id and id of the post's postedBy user id is same, allow update
  if (
    currrentUserFromDb._id.toString() !== postToUpdate.postedBy._id.toString()
  )
    throw new Error("Unauthorized action");

  // this method first arg id 2 what you want to update
  let updatedPost = await Post.findByIdAndUpdate(
    args.input._id,
    {
      ...args.input,
    },
    { new: true }
  ).exec();

  return updatedPost;
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
