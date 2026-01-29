const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true 
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, ref: "Event", 
        required: true 
    },
});
ticketSchema.index({ user: 1, event: 1 }, { unique: true });
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
