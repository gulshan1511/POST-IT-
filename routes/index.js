var express  = require("express");
var router   = express.Router();
var User     = require("../models/user");
var passport = require("passport");

router.get("/", (req,res)=>{
    res.render("posts/home");
});

//Auth Routes
//showing signup Form
router.get("/register", (req,res)=>{
    res.render("register");
});

router.post("/register", (req,res)=>{
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/posts");
        });
    });
});

// LOG IN routes
router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/posts",
    failureRedirect: "/login"
}),(req,res)=>{
    if(err){
        console.log(err);
        return res.redirect("/");
    }
});

// LOG out

router.get("/logout", (req,res)=>{
    req.logOut();
    res.redirect("/");
});

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// forgot-password
router.get("/forgot-password", (req, res, next)=>{
    res.render("forgot-password");
});

router.post("/forgot-password", (req,res,next)=>{
    const userEmail = req.body.email;
    //making sure user exist in database
    User.findOne({email: userEmail},(err,user)=>{
        if(user===null){
            res.send("User is not registered");
        }
        else{
            console.log(user);
            //user exist
            const secret = JWT_SECRET + user.password
            const payload = {
                email: user.email,
                id: user.id
            }
            const token = jwt.sign(payload, secret, {expiresIn: '15m'});
            const link = 'http://localhost:3000/reset-password/' + user.id + '/' + token;
            console.log(link);
            res.send("Password reset link has been send to yr email");
        }
    });
});

router.get("/reset-password/:id/:token", (req,res,next)=>{
    const {idi, token} = req.params;
    //check if id exist in the database
    User.findOne({id: idi}, (err,user)=>{
        if(user===null){
            res.send("Invalid id");
            return;
        }
        const secret = JWT_SECRET + user.password;
        try{
            const payload = jwt.verify(token,secret);
            res.render("reset-password", {user: user,token: token});
        }
        catch(error){
            console.log(error.message);
            res.send(error.message);
        }
    });
});

router.post("/reset-password/:id/:token", (req,res,next)=>{
    const {ids, token} = req.params;
    const {password, password2} = req.body;
    User.findOne({id: ids}, (err,user)=>{
        if(user===null){
            res.send("Invalid id");
            return;
        }
        const secret = JWT_SECRET + user.password;
        try{
            const payload = jwt.verify(token,secret);
            
            user.password = bcrypt.hashSync(password, 10);
            res.redirect("/login");

        }
        catch(error){
            console.log(error.message);
            res.send(error.message);
        }
    });
});


module.exports = router;