const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");

// use environmental variables
require("dotenv").config();

// create express server and invoke it
const app = express();

/*---------------------------------------------
         GRAPHQL SERVER
----------------------------------------------- */
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
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

/* Apply express app as middleware to appolo server
  this method connects Appolo Server to a specific HTTP framework i.e express
  When you use applyMiddleware method by default graphql will be served /graphql */
apolloServer.applyMiddleware({
  app,
});

// create a server
const httpserver = http.createServer(app);

// rest endpoint
app.get("/rest", (req, res) => {
  res.json({
    data: "you hit rest endpoint",
  });
});

// listen app on port number
app.listen(process.env.PORT, () => {
  console.log(`server is ready at http:// ${process.env.PORT}`);
  console.log(
    `graphql server is ready at http:// ${process.env.PORT} ${apolloServer.graphqlPath}`
  );
});

// Also handle start script in package.json
