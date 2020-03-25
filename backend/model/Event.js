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
    name: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Event = mongoose.model('events', EventSchema);