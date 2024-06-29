const listing=require("./models/listing.js");
const review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js")
module.exports.islogging=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Require is loging");
        res.redirect("/login");
    }
    next();
}
module.exports.SaveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//for isowner
module.exports.isOwner=async(req,res,next)=>{
let {id}=req.params;
let listingi=await listing.findById(id);
if(!listingi.owner._id.equals(res.locals.curruser._id))
{
    req.flash("error","you are not owner of listing");
    return res.redirect(`/listings/${id}`);
}
next();
}

//for listingSchema
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let ermsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,ermsg);
    }
    else{
        next();
    }
}

//for reviewschem
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let ermsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,ermsg);
    }
    else{
        next();
    }
}

//is author middleware
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {reviewid,id}=req.params;
    let review1=await review.findById(reviewid);
    console.log(review1);
    if(!review1.author._id.equals(req.user._id))
    {
        req.flash("error","you are not created review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}