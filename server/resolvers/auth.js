const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const User = require("../models/user");
const shortid = require("shortid");

// grab the cocntext req and res
// context also passed in graphql apollo server
// it is context.req which we have destructured
const profile = async (parent, args, { req }) => {
  // if authcheck returns then execute return statement here
  const currentUser = await authCheck(req);
  return await User.findOne({ email: currentUser.email }).exec();
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

const userUpdate = async (parent, args, { req }) => {
  // Gives us all user details
  // check to see logged in user
  const currentUser = await authCheck(req);

  // second argument is the one what will be placed at updated field
  // new: true means send new info back to client
  // exec gives us the promise when resolved give us data
  // Updated User is User return type in typeDef
  console.log(args, currentUser.email);
  const updatedUser = await User.findOneAndUpdate(
    { email: currentUser.email },
    { ...args.input },
    { new: true }
  ).exec();
  return updatedUser;
};

const publicProfile = async (parent, args, { req }) => {
  return await User.findOne({ username: args.username }).exec();
};

const allUsers = async (parent, args) => await User.find({}).exec();

module.exports = {
  Query: {
    profile,
    publicProfile,
    allUsers,
  },
  Mutation: {
    userCreate,
    userUpdate,
  },
};

// To run this userUpdate in Graphql we will use
// mutation userUpdate($input: UserUpdateInput) {
//   userUpdate(input: $input) {
//     _id
//     name
//     about
//     username
//   }
// }

// and in Query Variables button below click that and paste
// {
//   "input": {
//     "name": "Sehrish",
//     "about": "Heloooodfdf gfgd",
//     "username": "SSS"
//   }
// }
