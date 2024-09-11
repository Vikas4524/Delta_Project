
const express =require("express");
const router = express.Router();
const User = require("../Models/user.js");
const AsyncWrap = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
               // controllers
const userconroller = require("../controllers/user.js")

router.get("/signup", userconroller.rendersignupForm);


router.post("/signup",AsyncWrap( userconroller.signupUser)); 


router.get("/login",  userconroller.renderLoginForm); 
 
router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect : "login", failureFlash : true,}) ,
userconroller.loginUser
)


router.get("/logout", userconroller.logoutUser)
 

module.exports = router;

