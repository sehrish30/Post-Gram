const { gql } = require("apollo-server-express");
const { posts } = require("../temp");

/*--------------------------
       Queries
---------------------------*/

// return length
const totalPosts = () => posts.length;

// return array of posts
const allPosts = () => posts;

/*--------------------------
       Mutation
---------------------------*/

// parent -> parent mutation type e.g newPost
// args -> e.g args.title but you can also destructure it
const newPost = (parent, args, context) => {
  // create a new post Object


  const post = {
    id: posts.length + 1,
    ...args.input,
  };
  // push new post object to posts array
  posts.push(post);
  return post;
};

module.exports = {
  Query: {
    totalPosts,
    allPosts,
  },
  Mutation: {
    newPost,
  },
};