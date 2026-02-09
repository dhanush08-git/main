const mongoose = require("mongoose");
const Listing = require("./Models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wonder");

async function updateListings() {
  await Listing.updateMany(
    { category: { $exists: false } },
    { $set: { category: "Trending" } }
  );

  console.log("All old listings updated!");
  mongoose.connection.close();
}

updateListings();
