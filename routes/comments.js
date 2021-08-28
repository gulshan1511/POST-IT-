//==============
// COMMENTS ROUTES
//==============
var express = require("express");
var router = express.Router({ mergeParams: true });
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { post: post });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          post.comments.push(comment);
          post.save();
          req.flash("success", "Successfully addes comment");
          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

//COMMENTS EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", { post_id: req.params.id, comment: comment });
    }
  });
});
//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, comment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/posts/" + req.params.id);
      }
    }
  );
});

//COMMENT DESTROY

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/posts/" + req.params.id);
    }
  });
});


module.exports = router;
