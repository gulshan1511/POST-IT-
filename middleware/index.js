var Post = require("../models/post");
var Comment = require("../models/comment");
// All the MiddleWare goes here

var middlewareObj = {};

middlewareObj.checkPostOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, (err, post) => {
      if (err) {
        req.flash("error", "Post not found");
        res.redirect("back");
      } else {
        //does user own post
        if (post.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect("back");
      } else {
        //does user own comment
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in first");
  res.redirect("/login");
};

module.exports = middlewareObj;
