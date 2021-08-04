var express = require("express");
var router  = express.Router();
var Post    = require("../models/post");

router.get("/posts", (req,res)=>{
    console.log(req.user);
    Post.find({}, (err,posts)=>{
        if(err){
            console.log(err);
        }else{
            console.log(posts);
            res.render("posts/index", {posts: posts});
        }
    });
});

router.get("/posts/new", isLoggedIn, (req,res)=>{
    res.render("posts/new");
});

// CREATE ROUTE
router.post("/posts", isLoggedIn, (req,res)=>{
    Post.create(req.body.post, (err, post)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/posts");
            console.log(post);
        }
    });
});

//SHOW - show more information about one post
router.get("/posts/:id", isLoggedIn, (req,res)=>{
    Post.findById(req.params.id).populate("comments").exec((err,post)=>{
        if(err){
            console.log(err);
        }else{
            console.log(post);
            res.render("posts/show",{post: post});
        }
    });
});

// EDIT ROUTE
router.get("/posts/:id/edit", isLoggedIn, (req,res)=>{
    Post.findById(req.params.id, (err, post)=>{
        if(err){
            res.redirect("/posts");
        } else{
            res.render("posts/edit", {post: post});
        }
    });
     
});

// UPDATE ROUTE

router.put("/posts/:id", isLoggedIn, (req,res)=>{
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post)=>{
        if(err){
            res.redirect("/posts");
        } else{
            res.redirect("/posts/"+req.params.id);
        }
    });
});

// DESTROY ROUTE

router.delete("/posts/:id", isLoggedIn, (req, res)=>{
    Post.findByIdAndRemove(req.params.id, (err,post)=>{
        if(err){
            res.redirect("/posts");
        } else{
            res.redirect("/posts");
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