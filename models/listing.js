const mongoose = require("mongoose");
const review=require("./review.js");
const { listingSchema } = require("../schema");
const schemalist = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "not added",
  },
  image: {
   url:String,
   filename:String,
  },
  price: {
    type: Number,
    require: true,
  },
  
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
});

//this middl
schemalist.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await review.deleteMany({_id:{$in:listing.reviews}});
  }
});
const listing = mongoose.model("listing", schemalist);
module.exports = listing;
