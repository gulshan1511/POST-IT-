const mongoose = require("mongoose");

//SCHEMA SETUP
const postSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    likes: {
        type: Number,
        default: 0
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Post = mongoose.model("Post",postSchema);

module.exports = Post;