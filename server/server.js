const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const { authCheck } = require("./helpers/auth");

// use environmental variables
require("dotenv").config();

// create express server and invoke it
const app = express();

/*---------------------------------------------
         Mongo DB
----------------------------------------------- */
const db = async () => {
  try {
    // connect requires arguments i.e url, configuration options to get rid of depcration warnings
    const success = await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Connection Error", err);
  }
};

// exceute database connection
db();

/*---------------------------------------------
         GRAPHQL SERVER
----------------------------------------------- */
/* graphql server we need
types - consists query / mutation/ subscription
resolvers - function to resolve query or mutation and send data to client */

// ! mark to check its not empty or null
// Go to root directory go to typeDefs folder and load all files
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);
// resolvers
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

// Create a graphql server
// pass type and resolver
// merge all files in typeDefs and pass to apollo Server
// context makes req and res available to resolvers
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
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
// when authCheck is true next() will execute res.json line
// when authCheck throws error res.json() wont get executed
app.get("/rest", authCheck, (req, res) => {
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
