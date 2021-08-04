var express = require("express");
var router  = express.Router();
var Post    = require("../models/post");

router.get("/", isLoggedIn, (req,res)=>{
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

router.get("/new", isLoggedIn, (req,res)=>{
    res.render("posts/new");
});

// CREATE ROUTE
router.post("/", isLoggedIn, (req,res)=>{
    const author = {
        id: req.user._id,
        username: req.user.username
    }

    const newPost = {name: req.body.name, image: req.body.image, description: req.body.description, author: author}

    Post.create(newPost, (err, post)=>{
        if(err){
            console.log(err);
        } else{
            console.log(post);
            res.redirect("/posts");
            console.log(post);
        }
    });
});

//SHOW - show more information about one post
router.get("/:id", (req,res)=>{
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
router.get("/:id/edit", checkPostOwnership, (req,res)=>{
        Post.findById(req.params.id, (err, post)=>{
            res.render("posts/edit", {post: post});
        });
    }); 


// UPDATE ROUTE

router.put("/:id", checkPostOwnership, (req,res)=>{
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post)=>{
        if(err){
            res.redirect("/posts");
        } else{
            res.redirect("/posts/"+req.params.id);
        }
    });
});

// DESTROY ROUTE

router.delete("/:id", checkPostOwnership, (req, res)=>{
    Post.findByIdAndRemove(req.params.id, (err,post)=>{
        if(err){
            res.redirect("/posts");
        } else{
            res.redirect("/posts");
        }
    });
});

//Middlewares
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkPostOwnership(req,res,next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, (err, post)=>{
            if(err){
                res.redirect("back");
            } else{
                //does user own post
                if(post.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = router;