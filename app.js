const express         = require("express"),
app                   = express(),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
User                  = require("./models/user"),
jwt                   = require("jsonwebtoken"),
bcrypt                = require("bcrypt"), 
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

const JWT_SECRET = 'secret..';

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

// forgot-password
app.get("/forgot-password", (req, res, next)=>{
    res.render("forgot-password");
});

app.post("/forgot-password", (req,res,next)=>{
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

app.get("/reset-password/:id/:token", (req,res,next)=>{
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

app.post("/reset-password/:id/:token", (req,res,next)=>{
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

app.listen(3000, ()=>{
    console.log("SERVER STARTED");
});