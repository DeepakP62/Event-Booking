const express = require("express");
const router = express.Router();
const Event = require("../models/Event.js");
const Ticket = require("../models/Ticket.js");

router.get("/new",(req,res)=>{
    if(!res.locals.currUser){
        req.flash("error_msg", "Must Be Signup!");
        return res.redirect("/signup");
    }
    res.render("events/new.ejs");
});

router.post("/",async (req,res)=>{
    
    let newEvent = new Event({
        name : req.body.name,
        description : req.body.description,
        seatsAvailable : req.body.seatsAvailable,
        date : req.body.date,
        totalSeats: req.body.totalSeats,
    });
    let create = await newEvent.save();
    req.flash("success_msg","Your Event is Created!");
    res.redirect("/");
});

router.get("/:id", async(req,res)=>{
    let {id} = req.params;
    const event = await Event.findById(id);
    res.render("events/show.ejs",{event});
});

router.get("/:id/edit",async (req,res)=>{
    
    if(!res.locals.currUser){
        req.flash("error_msg", "Must Be Signup!");
        return res.redirect("/signup");
    }
    let {id} = req.params;
    const event = await Event.findById(id);
    res.render("events/edit.ejs",{event});
});

router.patch("/:id/edit", async(req,res)=>{
    
    let {id} = req.params;
    let newEvent = {
        name : req.body.name,
        description : req.body.description,
        totalSeats : req.body.totalSeats,
        seatsAvailable : req.body.seatsAvailable,
        date : req.body.date,
    }
    const update = await Event.findByIdAndUpdate(id,newEvent);
    req.flash("success_msg","Event is updated!");
    res.redirect(`/event/${id}`);
});

router.delete("/:id",async (req,res)=>{
  
    if(!res.locals.currUser){
        req.flash("error_msg", "Must Be Signup!");
        return res.redirect("/signup");
    }
    let {id} = req.params;
    const event = await Event.findByIdAndDelete(id);
    req.flash("success_msg", "Event is Deleted / Cancle!");
    res.redirect("/");
});

router.post("/:id/ticketBooking",async (req,res)=>{
    let {id} = req.params;
    if(!res.locals.currUser){
        req.flash("error_msg", "Must Be Signup!");
        return res.redirect("/signup");
    }
    let user = res.locals.currUser._id;
    try{
        const event = await Event.findById(id);
        if(event.seatsAvailable <= 0){
            return res.status(400).send("No seats available");
        }
        const exists = await Ticket.findOne({ user, event: id });
        if (exists){
            req.flash("error_msg", "Already Booked Your Ticket");
            return res.redirect(`/event/${id}`);
            //return res.status(400).send("Already booked");
        }
        const ticket = new Ticket({
            user : user,
            event : id,
        });
        const newTicket = await ticket.save();
        event.seatsAvailable -= 1;
        await event.save();
        req.flash("success_msg", "Ticket booked successfully!");
        res.redirect(`/event/${id}`);
    }catch(err){
        console.log(err);
        res.send("Something want wrong");
    }
})

module.exports = router;