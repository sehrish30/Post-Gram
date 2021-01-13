const { gql } = require("apollo-server-express");

const me = () => "Sehrish";

module.exports = {
  Query: {
    me,
  },
};
