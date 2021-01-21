const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

const { authCheckMiddleware } = require("./helpers/auth");

// Publish and Subsscribe
const pubsub = new PubSub();

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

// middlewares
app.use(cors());

// Controls the maximum request body size
// the value is passed to the bytes library for parsing
app.use(
  bodyParser.json({
    limit: "5mb",
  })
);

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
// also make pubsub available in context
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, pubsub }) => ({ req, res, pubsub }),
});

/* Apply express app as middleware to appolo server
  this method connects Appolo Server to a specific HTTP framework i.e express
  When you use applyMiddleware method by default graphql will be served /graphql */
apolloServer.applyMiddleware({
  app,
});

// create a server
const httpserver = http.createServer(app);

// Integrate with http so http servers provide Graphql subscriptions
apolloServer.installSubscriptionHandlers(httpserver);

// rest endpoint
// when authCheck is true next() will execute res.json line
// when authCheck throws error res.json() wont get executed
// app.get("/rest", authCheck, (req, res) => {
//   res.json({
//     data: "you hit rest endpoint",
//   });
// });

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* On Client side we will resize data and 
  send binary data back to the server on this end point
  this function will upload to cloudinary and give us response
  scaffolded in 2 argument */
app.post("/uploadimages", authCheckMiddleware, (req, res) => {
  // first argument will be image and
  // third argument for public view info (public name & resource type)
  // req.body.image binary data of image
  cloudinary.uploader.upload(
    req.body.image,
    (result) => {
      console.log(result);
      res.send({
        url: result.secure_url,
        public_id: result.public_id,
      });
    },
    {
      public_id: `${Date.now()}`, // public name
      resource_type: "auto", //JPEG, PNG
    }
  );
});

/* When we store image we store its public id so 
   when user wants to delete he sends this to cloudinary
   to remove this public_id  */
app.post("/removeimage", authCheckMiddleware, (req, res) => {
  // all needed is image_id to del image in cloudinary
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ success: false, error });
    res.send("ok", result);
  });
});

// listen app on port number
app.listen(process.env.PORT, () => {
  console.log(`server is ready at http:// ${process.env.PORT}`);
  console.log(
    `graphql server is ready at http:// ${process.env.PORT} ${apolloServer.graphqlPath}`
  );

  // After this we are ready to install pubsub pattern in our resolvers to implmement subscriptions
  console.log(
    `Subscription is ready at http:// ${process.env.PORT} ${apolloServer.subscriptionsPath}`
  );
});

// Also handle start script in package.json
