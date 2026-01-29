const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const User = require("./models/User.js");
const Event = require("./models/Event.js");
app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
const userRoutes = require("./routes/userRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/event_booking");
}
main().then(()=>{
    console.log("connect to Database!");
}).catch((err)=>{
    console.log("somethig want wrong", err);
})

app.use(session({
  secret: "yourSecret",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});


app.use(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, "mysupersecretkey");
            const user = await User.findById(decoded.id);
            res.locals.currUser = user || null; 
        } else {
            res.locals.currUser = null;
        }
    } catch (err) {
        res.locals.currUser = null;
    }
    next();
});

// view all Event
app.get("/", async(req,res)=>{
    const allEvent = await Event.find();
    res.render("events/index.ejs",{allEvent});
})

app.use("/",userRoutes);
app.use("/event",eventRoutes);


// connect to the server
const port = 5000;
app.listen(port,()=>{
    console.log(`app is listing on port ${port}`);
})