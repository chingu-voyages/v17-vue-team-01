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
    start: {
        type: Date,
        default: null,
    },
    end: {
        type: Date,
        default: null,
    },
    scheduled: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
    }
});

module.exports = Event = mongoose.model('events', EventSchema);