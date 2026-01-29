const mongoose = require("mongoose");
const Event = require("../models/Event.js");
const Data = require("./db.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/event_booking");
}
main().then(()=>{
    console.log("connect to Database!");
}).catch((err)=>{
    console.log("somethig want wrong", err);
})

const addData = async ()=>{
    const data = Data.data;
    const allData = await Event.insertMany(data);
    console.log(allData);
    //await Event.deleteMany({});
}

addData();