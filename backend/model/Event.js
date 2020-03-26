const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Event Schema
const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true,
    },
    time: {
        type: date,
        required: true,
        default: Date()
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Event = mongoose.model('events', EventSchema);