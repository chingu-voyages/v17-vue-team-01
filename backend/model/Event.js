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
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    color: {
        type: String
    }
});

module.exports = Event = mongoose.model('events', EventSchema);