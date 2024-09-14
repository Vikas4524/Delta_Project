if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);


const express =require("express");
const mongoose = require("mongoose");
// const Listing = require("./Models/listing.js");
// const Review = require("./Models/review.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// const AsyncWrap = require("./utils/wrapAsync.js");
// const {Schema , reviewSchema} = require("./Views/schema.js");
const expressError = require("./utils/ExpressError.js");
const { error } = require("console");
const { wrap } = require("module");
const { array } = require("joi");

                    //    password
const passport = require("passport");
const LocalStrategy = require("passport-local");  //mongo cloud   
const User = require("./Models/user.js");

const Session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
 const dbUrl = process.env.ATLASDB_URL; 

async function main() {
    await mongoose.connect(dbUrl);    
};

                        //   Express Router
const Listings = require("./routes/listing.js")
const Reviews = require("./routes/review.js")
const users = require("./routes/user.js")

const app = express();
const port = 8080;

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname ,"Views"));
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET,
    }, 
    touchAfter: 24*3600,
});
 
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 *24*60*60*1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly :true,
    },  
};




app.use(Session(sessionOptions));

app.use(flash());



                //   password
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// / use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    
    next(); 
});

                    // Demo user
// app.get("/demouser", async(req,res)=>{
//    let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-studentVikas",
//    });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// })

                //    Express Router REstructuring
    app.use("/", Listings);
    app.use("/", Reviews);
    app.use("/", users);
    
     
 

    app.all("*",(req,res,next)=>{
        next(new expressError(404, "page is Not  Found!"));
    })

            //   middleWare 
 app.use((err,req,res,next)=>{
   let {statusCode = 500 , message = "Something went wrong!"} = err;
   res.render("Error.ejs", {err});
 })



app.listen(port, ()=>{
    console.log(`server is listen to port ${port}`);
});




                            //  mongoDB Cannections 

main()
.then((res)=>{
    console.log("connection working");
})
.catch((err)=>{
    console.log(err);
});






 
