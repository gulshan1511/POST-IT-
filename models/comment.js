const mongoose = require("mongoose");

const Comment = new mongoose.model("Comment", {
    text: String,
    author: String
});

module.exports = Comment;