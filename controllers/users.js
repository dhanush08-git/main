const User = require('../Models/User.js');

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup");
};


module.exports.signup = async (req,res)=>{
  try {
    let {username, email, password} = req.body;

    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success","Welcome to the App!");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/users/signup");
  }
}

module.exports.renderLogin = (req,res) => {
    res.render("users/login");
};

module.exports.logout = (req,res) => {
  req.logout((err) => {
    if(err){
      next(err);
    }
    req.flash("success","Logged out Successfully!");
    res.redirect("/listings");
  });
  
};


module.exports.login = async(req,res) => {
  req.flash("success","Logged in Successfully!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};