const listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const reviewl=require("../models/review.js");
const { restart } = require("nodemon");
const {listingSchema}=require("../schema.js");
module.exports.index=async(req,res)=>{
    let alllistings=await listing.find();
    res.render("listings/listings.ejs",{alllistings});
};

module.exports.rendernewlistingform=(req,res)=>{
    res.render("listings/add.ejs");
};

module.exports.addnewlisting=async(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error)
    {
        throw new ExpressError(400,result.error);
    }
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,filename);
    let newlisting=new listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    console.log(newlisting);
    await newlisting.save();
    req.flash("success","listing is created succefully");
    res.redirect("/listings");
}

module.exports.rendershowlisting=async(req,res)=>{
    let {id}=req.params;
    let listingi=await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listingi);
    if(!listingi)
    {
        req.flash("error","listing is not exist");
        res.redirect("/listings");
    }
    console.log(listingi);
    res.render("listings/show.ejs",{listingi});
}

module.exports.redereditlistingform=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let listinge=await listing.findById(id);
    if(!listinge)
    {
        req.flash("error","listing is not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listinge});
}

module.exports.editlisting=async(req,res)=>{
    let {id}=req.params;
    console.log(req.body.listing);
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroylisting=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    await listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    res.redirect("/listings");
}

