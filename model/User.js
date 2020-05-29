const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the User Schema
const UserSchema = new Schema({
    events: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "events"
        }
      ],
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    TZ: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    emailOpt: {
        type: Boolean,
        default: true
    }
});

module.exports = User = mongoose.model('users', UserSchema);