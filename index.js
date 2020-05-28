// requiring dependencies
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//database connection
const uri = "mongodb+srv://dbUser:db12345@cluster0-vogn1.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(uri,{ useNewUrlParser: true });

// db user schema
var userSchema = new mongoose.Schema({
    username: {type:String, required: true },
    email: {type:String, required: true },
    password: {type:String, required: true },
    dob: {type:String, required: true },
    hobby: {type:String, required: true },
    location: {type:String, required: true }
});
var User = mongoose.model("user",userSchema);

// routes
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs"); //setting view engine

app.get('/',(req,res)=>{  // home route
    res.render("login");
})
app.get('/login',(req,res)=>{
    res.render("login");
})

app.post("/login",(req,res)=>{
    User.findOne({ email: req.body.email }, function (err, user) { //finding user with email
        if (err) { 
            console.log(err) 
        }
        else if (!user) { // if email does not exists
            console.log("Incorrect email");
        }
        else if (user.password != req.body.password) { //if password does not match
            console.log(User.password)
            console.log("Incorrect password");
        }
        else // authentication successfull then show information.
            res.render("show",{user: user});
      })
    })

app.get('/register',(req,res)=>{ 
    res.render("register");
})

app.get("/logout",(req,res)=>{ //logout route
    req.logout();
    res.redirect("/");
})

//route to register new user

app.post("/register",(req,res)=>{ 
    var newUser = new User ({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        location : req.body.location,
        hobby : req.body.hobby,
        dob : req.body.dob
    })
    // finding if any user with email already exists
    User.find({email: req.body.email},(err,x)=>{ 
        if(x.length>=1) //if user exists then stop registration with error message.
            res.render("error",{msg: "User with email already exists !"});
        if(x.length < 1) //if no user exists then continue registration.
            {
                console.log("hi"+newUser)
                User.create(newUser,(err,doc)=>{
                    if(err)
                    {
                        console.log(err);
                        return res.render("register");
                    }
                    else
                    {
                        res.render("show",{user: doc});
                    }
                })
            }
    })
})
app.get("/show",(req,res)=>{
    res.render("error",{msg:"Login required !"})
})
var port = 1111
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})
