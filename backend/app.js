const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

// Initialize the app
const app = express();

// Middleware
// Form Data Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

// Json Body Middleware
app.use(bodyParser.json());

// Cors Middleware
app.use(cors());

// Set up the static directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the passport Middleware
app.use(passport.initialize());
// Bring in the Passport Strategy
require('./config/passport')(passport);

// Bring in the Database Config and connect with the database
const db = require('./config/keys').mongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect with the database ${err}`)
});

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
    //return res.send("<h1>Hello World</h1>");
});
// Bring in the Users route
const users = require('./routes/api/users');
app.use('/api/users', users);

// Bring in the Events route
const events = require('./routes/api/events');
app.use('/api/events', events);

// Bring in the Timeslot route
const timeslots = require('./routes/api/timeslots');
app.use('/api/timeslots', timeslots);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})