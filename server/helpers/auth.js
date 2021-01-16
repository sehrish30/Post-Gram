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
