const mongoose = require("mongoose");

//SCHEMA SETUP
const postSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    likes: Number,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Post = mongoose.model("Post",postSchema);

module.exports = Post;