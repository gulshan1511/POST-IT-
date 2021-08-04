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
mongoose              = require("mongoose");

const postRoutes      = require("./routes/posts");
const commentRoutes   = require("./routes/comments");
const indexRoutes     = require("./routes/index");


mongoose.connect('mongodb://localhost/auth_task', {useNewUrlParser: true, useUnifiedTopology: true});
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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==========
//middleware
//==========
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(postRoutes);


const JWT_SECRET = 'secret..';

seedDB();

//=======
// ROUTES
//=======




//=========
// LIKE ROUTE
//=========

app.post("/posts/:id/likes", (req,res)=>{
    let query = { _id: req.params.id};
    Post.findOneAndUpdate(
        query, 
        {$inc:{ likes: 1}},
        (err, post) => {   
            console.log(post);
            res.redirect('/posts/' + post._id);
        }
    )  
});


app.listen(3000, ()=>{
    console.log("SERVER STARTED");
});