const User = require("../Models/user.js");


module.exports.rendersignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupUser =async(req,res)=>{
    try {
        let {username , email, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
       
    } catch (error) {
        req.flash("success", error.message);
        res.redirect("/signup");
    } 
   
};

module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginUser =async (req,res) =>{
    req.flash("success", "Welcome to Wanderlust! you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
   
   
               // or 
   
   // if (res.locals.redirectUrl) {
   //        res.redirect(res.locals.redirectUrl);    
   // } else {
   //  res.redirect("/listings");
       
   // }
   
   };

   module.exports.logoutUser  =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}