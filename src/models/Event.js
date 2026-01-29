const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name : {
        type : String,
        required: true,
    },
    description : {
        type : String,
    },
    date : {
        type : Date,
    },
    totalSeats : {
        type : Number,
    },
    seatsAvailable : {
        type : Number,
    },
    imageUrl : {
        type : String,
        set : (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxZE-xyhE-FoM4X3W4lwAA8MhAb3g42quleg&s" : v,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxZE-xyhE-FoM4X3W4lwAA8MhAb3g42quleg&s",
    },
});

const Event = mongoose.model("Event",eventSchema);
module.exports = Event;