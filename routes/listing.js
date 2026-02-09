const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const user=require('../Models/User.js');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');
const listingController=require('../controllers/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudinary.js');
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.createRoute));

//New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image][url]'), 
    validateListing, 
    wrapAsync(listingController.updateRoute))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyRoute));

// //Insex Route

// router.get("/", wrapAsync(listingController.index));




// //show route

// router.get("/:id",wrapAsync(listingController.showRoute));



// //create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createRoute));



//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editRoute));

// //Update Route
// router.put("/:id",isLoggedIn,
//     isOwner, validateListing, wrapAsync(listingController.updateRoute));

// //Delete Route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyRoute));


module.exports = router;








