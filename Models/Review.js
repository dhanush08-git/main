const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: {               // ✅ ADD THIS
    type: String,
    required: true
  },
  createdAt:{
    type: Date,
    default:Date.now(),
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
