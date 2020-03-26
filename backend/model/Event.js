const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Event Schema
const EventSchema = new Schema({
    users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
});

module.exports = Event = mongoose.model('events', EventSchema);