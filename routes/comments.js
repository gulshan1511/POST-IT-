//==============
// COMMENTS ROUTES
//==============
var express = require("express");
var router  = express.Router();
var Post    = require("../models/post");
var Comment = require("../models/comment");

router.get("/posts/:id/comments/new", isLoggedIn, (req,res)=>{
    Post.findById(req.params.id, (err, post)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {post: post});
        }
    });
    
});

router.post("/posts/:id/comments", (req,res)=>{
    Post.findById(req.params.id, (err,post)=>{
        if(err){
            console.log(err);
            res.redirect("/posts");
        }
        else{
            Comment.create(req.body.comment, (err,comment)=>{
                if(err){
                    console.log(err);
                }
                else{
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;