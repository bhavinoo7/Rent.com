const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")//wrap async function

const multer  = require('multer')
const {storage}=require("../CloudConfing.js");
const upload = multer({ storage })
const {islogging, isOwner,validateListing}=require("../middleware.js");




const listingcontroller=require("../controllers/listing.js");



router.route("/")
.get( wrapAsync(listingcontroller.index))
.post(islogging,upload.single('listing[image]'),wrapAsync(listingcontroller.addnewlisting));


//add route
router.get("/new",islogging,listingcontroller.rendernewlistingform);

router.route("/:id")
.get(wrapAsync(listingcontroller.rendershowlisting))
.patch(islogging,isOwner,validateListing,wrapAsync(listingcontroller.editlisting))
.delete(islogging,isOwner,wrapAsync(listingcontroller.destroylisting));


//edit route
router.get("/:id/edit",islogging,isOwner,wrapAsync(listingcontroller.redereditlistingform));



module.exports=router;