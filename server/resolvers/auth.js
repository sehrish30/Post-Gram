const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const User = require("../models/user");
const shortid = require("shortid");

// grab the cocntext req and res
// context also passed in graphql apollo server
const me = async (parent, args, { req }) => {
  // if authcheck returns then execute return statement here
  await authCheck(req);
  return "SEhrish";
};

const userCreate = async (parent, args, { req }) => {
  // Gives us all user details
  // shortid.generate()
  const currentUser = await authCheck(req);

  // Query db and find if user with same email
  const user = await User.findOne({ email: currentUser.email });

  // if user found kdddeep same user else update user
  return user
    ? user
    : new User({
        email: currentUser.email,
        username: shortid.generate(),
      }).save();
};

module.exports = {
  Query: {
    me,
  },
  Mutation: {
    userCreate,
  },
};
