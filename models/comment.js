const mongoose = require("mongoose");

const Comment = new mongoose.model("Comment", {
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

module.exports = Comment;
