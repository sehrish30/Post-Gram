// Use firebase admin-tool
const admin = require("firebase-admin");

const serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// AUTHENTICATION CHECK IN GRAPHQL RESOLVERS
exports.authCheck = async (req) => {
  try {
    console.log(req.headers.authtoken);
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.info("CURRENT USER", currentUser);
    return currentUser;
  } catch (err) {
    console.error("AUTH CHECK ERROR", err);
    throw new Error("Invalid or expired token");
  }
};

// Check if user is logged in to protect routes
exports.authCheckMiddleware = (req, res, next) => {
  // token will be sent in headers by axios
  if (req.headers.authtoken) {
    // check the token from firebase (verifyIdToken) if valid go to next which is callback
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then((result) => {
        next();
      })
      .catch((err) => console.log(err));
  } else {
    res.json({ error: "Unauthorized" });
  }
};
