const express         = require("express"),
app                   = express(),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
User                  = require("./models/user"),
Post                  = require("./models/post"),
Comment               = require("./models/comment"),
jwt                   = require("jsonwebtoken"),
bcrypt                = require("bcrypt"), 
methodOverride        = require("method-override"),
seedDB                = require("./seeds"),
mongoose              = require("mongoose"),
flash                 = require("connect-flash");

const postRoutes      = require("./routes/posts");
const commentRoutes   = require("./routes/comments");
const indexRoutes     = require("./routes/index");


// mongoose.connect('mongodb://localhost/auth_task', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://gulshan:password@123@post-it.k38ug.mongodb.net/Post-it?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
//mongodb+srv://gulshan:<password@123>@post-it.k38ug.mongodb.net/Post-it?retryWrites=true&w=majority
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "HELLO",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==========
//middleware
//==========
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/posts", postRoutes);


const JWT_SECRET = 'secret..';

// seedDB(); // seed database



app.listen(3000, ()=>{
    console.log("SERVER STARTED");
});