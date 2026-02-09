const Listing = require('../Models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let filter = {};
// search logic
  if (req.query.search) {
  filter.$or = [
    { location: { $regex: req.query.search, $options: "i" } },
    { title: { $regex: req.query.search, $options: "i" } },
    { country: { $regex: req.query.search, $options: "i" } }
  ];
}
  // category filter (if already implemented)
  if (req.query.category) {
    filter.category = req.query.category;
  }


  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showRoute = async (req, res) => {
    let {id} = req.params;
    console.log("PARAM ID:", req.params.id);

    const listing=await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author"}
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing, mapToken: process.env.MAP_TOKEN});
};


module.exports.createRoute =module.exports.createRoute = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url: url, filename: filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();

    console.log(savedListing);

    req.flash("success","Successfully created a new listing!");
    res.redirect("/listings");
};


module.exports.editRoute = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }

    let originalimage =listing.image.url;
    originalimage = originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalimage });
};


module.exports.updateRoute = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
    }

    req.flash("success","Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyRoute = async (req, res) => {
    let {id} = req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};