const express=require("express");
const router=express.Router({mergeParams:true});


const wrapAsync=require("../utils/wrapAsync.js")

const { restart } = require("nodemon");


const { route } = require("./listing.js");
const {islogging,isReviewAuthor,validateReview}=require("../middleware.js");
//for review contoller
const reviewcontroller=require("../controllers/review.js");


// review route
router.post("/",islogging,validateReview,wrapAsync(reviewcontroller.addreview));

//delete review 
router.delete("/:reviewid",islogging,isReviewAuthor,wrapAsync(reviewcontroller.destroyreview));

module.exports=router;