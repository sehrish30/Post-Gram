const { ApolloServer } = require("apollo-server");
require("dotenv").config();

/* graphql server we need
types - consists query / mutation/ subscription
resolvers - function to resolve query or mutation and send data to client */

// ! mark to check its not empty or null
const typeDefs = `
   type Query {
       totalPosts: Int!
   }
`;

// resolvers
const resolvers = {
  Query: {
    totalPosts: () => 42,
  },
};

// Create a graphql server
// pass type and resolver
const appolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// listen app on port number
appolloServer.listen(process.env.PORT, () => {
  console.log(`Graphql server is ready at http:// ${process.env.PORT}`);
});
