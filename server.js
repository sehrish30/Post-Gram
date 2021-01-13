const express = require("express");
// use environmental variables
require("dotenv").config();

// create express server and invoke it
const app = express();

// rest endpoint
app.get("/rest", (req, res) => {
  res.json({
    data: "you hit rest endpoint",
  });
});

// listen app on port number
app.listen(process.env.PORT, () => {
  console.log(`server is ready at http:// ${process.env.PORT}`);
});

// Also handle start script in package.json
