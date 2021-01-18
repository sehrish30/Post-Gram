const { gql } = require("apollo-server-express");
const { posts } = require("../temp");
const { authCheck } = require("../helpers/auth");
const Post = require("../models/post");
const User = require("../models/user");

/*--------------------------
       Queries
---------------------------*/

/*--------------------------
       Mutation
---------------------------*/

// populate because ref to that particular model
const postCreate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  console.log("WHAT", currentUser);

  // validation
  if (args.input.content === "") throw new Error("Content is required");

  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  });

  // instantiating new post using post model
  let newPost = await new Post({
    ...args.input,
    postedBy: currentUserFromDb.uid,
  })
    .save()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());

  return newPost;
};

module.exports = {
  Query: {},
  Mutation: {
    postCreate,
  },
};
