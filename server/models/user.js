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
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    images: {
      type: Array,
      default: [
        {
          url:
            "https://i.pinimg.com/236x/95/5d/d2/955dd2db859436396be4437513805145.jpg",
          public_id: Date.now,
        },
      ],
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
