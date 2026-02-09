const mongoose = require('mongoose');
const initData=require("./data.js");
const Listing = require('../Models/listing.js');

const MONGO_URL = 'mongodb://localhost:27017/wonder';




main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
await Listing.deleteMany({});
initData.data = initData.data.map((obj) => ({...obj,owner:'69832f27d3a5c9d6a86e7570'}));
await Listing.insertMany(initData.data);
console.log("data was initialized");
};

initDB();