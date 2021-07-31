const express         = require("express"),
app                   = express(),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
User                  = require("./models/user"),
mongoose              = require("mongoose");


app.use(require("express-session")({
    secret: "HELLO",
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://localhost/auth_task', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=======
// ROUTES
//=======

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/secret", isLoggedIn, (req,res)=>{
    res.render("secret");
});

//Auth Routes
//showing signup Form
app.get("/register", (req,res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/secret");
        });
    });
});

// LOG IN routes
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),(req,res)=>{
    if(err){
        console.log(err);
        return res.render("/");
    }
});

// LOG out

app.get("/logout", (req,res)=>{
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

app.listen(3000, ()=>{
    console.log("SERVER STARTED");
});