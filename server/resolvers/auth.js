const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");

// grab the cocntext req and res
// context also passed in graphql apollo server
const me = async (parent, args, { req }) => {
  // if authcheck returns then execute return statement here
  await authCheck(req);
  return "SEhrish";
};

module.exports = {
  Query: {
    me,
  },
};
