const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// index so we can find the user from the database
// model acts like a table in database
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String.fromCharCode,
      required: true,
      index: true,
    },
    images: {
      type: Array,
      default: {
        url: "https://via.placeholder.com/200*200.png?text=Profile",
        public_id: Date.now,
      },
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);
// timestamps means created at and updated at fields will be automatically updated

// first pass model name second argument model schema
module.exports = mongoose.model("User", userSchema);
