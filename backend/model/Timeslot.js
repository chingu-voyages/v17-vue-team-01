// Create the Timeslot Schema
const TimeslotSchema = new Schema({
    event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event"
        },
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
    day: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

module.exports = Timeslot = mongoose.model('timeslots', TimeslotSchema);