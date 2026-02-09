const Listing = require('./Models/listing.js');
const ExpressError=require('./utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('./schema.js');
const Review = require('./Models/Review.js');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){

        //redirectUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a new listing!");
        return res.redirect("/listings");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next) => {
     let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error","You don't have permission to do that!");
       return res.redirect(`/listings/${id}`) ;

    }
    next();
}


module.exports.validateListing = (req,res,next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);  // ✅ send STRING
    }
    next();
};

module.exports.validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);  // ✅ send STRING
    }
    next();
};



module.exports.isReviewAuthor = async (req,res,next) => {
     let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","You don't have permission to do that!");
       return res.redirect(`/listings/${id}`) ;

    }
    next();
}



