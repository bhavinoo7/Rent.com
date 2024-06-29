if(process.env.NODE_ENV!="production")
{
    require('dotenv').config()
}

console.log(process.env);


const express=require("express");//fpr express
const app=express();
app.set("view engine","ejs");//for ejs
const path=require("path");//for path
const ejsMate=require("ejs-mate");//for ejs-mate
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));//parse
app.set("views",path.join(__dirname,"views"));//find path
app.use(express.static(path.join(__dirname,"/public")));//find path
const mongoose=require("mongoose");//for mongoose
const methodOverride=require("method-override");//for methodoverride
const session=require("express-session");
const flash=require("connect-flash");
app.use(methodOverride("_method"));
const passport=require("passport");
const localStretgy=require("passport-local");

//connect database
const main=async ()=>{
    await mongoose.connect("mongodb+srv://bhavin:bhavin123@cluster0.mgx7o8u.mongodb.net/project");
}
//for database
main().then((res)=>{
    console.log("succes");
}).catch((err)=>{
    console.log(err);
});

const listing=require("./models/listing.js");//listing model
const wrapAsync=require("./utils/wrapAsync.js")//wrap async function
const ExpressError=require("./utils/ExpressError.js")//expresseroor class
const reviewl=require("./models/review.js");
const { restart } = require("nodemon");
const User=require("./models/user.js");
//port
const port=3000;
const sessionoption={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*30*1000,
        maxAge:7*24*60*30*1000,
        httpOnly:true
    }
}
app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStretgy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});


const listingrouter=require("./routers/listing.js");
const reviewrouter=require("./routers/review.js");
const userrouter=require("./routers/user.js");




app.use("/listings",listingrouter);
app.use("/listings/:id/review",reviewrouter);
app.use("/",userrouter);
app.get("/",(req,res)=>{
   res.redirect("/listings")
});
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});


app.use((err,req,res,next)=>{
    let {status=500,message="some error"}=err;
    res.status(status).render("error.ejs",{message});
});


app.listen(port,()=>{
    console.log("Web listen");
});
