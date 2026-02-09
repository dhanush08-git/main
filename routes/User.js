const express = require('express');
const router = express.Router();
const User = require('../Models/User.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl,validateReview } = require('../middleware.js');
const userController=require('../controllers/users.js');



router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));


router.get('/logout',userController.logout);


router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/users/login", failureFlash:true}),userController.login
);



module.exports = router;
