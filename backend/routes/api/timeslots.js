const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../model/User');
const Event = require('../../model/Event');
const Timeslot = require('../../model/Timeslot');
const mongoose = require('mongoose');

/**
 * @route POST api/timeslots/create
 * @desc Create timeslots
 * @access Public
 */
router.post('/create', (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
    
    jwt.verify(token, key, function(err, decoded) {
      if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
  
      let {
        event_id,
        timeslots
      } = req.body;

      const user_id = decoded._id;

      timeslots.forEach(timeslot => {

        timeslot.forEach(tsContent => {
          let day = timeslot[0];
          if(tsContent != day){
            let newTimeslot = new Timeslot({
              user: user_id,
              event: event_id,
              day: day,
              time: tsContent,
            });
  
            newTimeslot.save().then(timeslot => {
              console.log("Congrats, timeslot " + timeslot + " created");
            
            });
          }
        });      
      });

      res.status(200).json({
        success: true,
        msg: "Congrats, timeslots created!"
    });
    });
});


/**
 * @route POST api/timeslots/delete
 * @desc Delete timeslot
 * @access Public
 */
router.post('/delete', (req, res) => {
  let timeslot_id = req.body.timeslot_id;
  //console.log(timeslot_id);
  Timeslot.findOne( {_id: timeslot_id}  ).then((result) => {
    if(!result){
      return res.status(200).json({
        success: false,
        msg: "Timeslot not found!"
    });
    }
    let users = result.users;
    users.forEach(user =>
      User.findOneAndUpdate({
        _id: user._id,
        timeslots: {$eq: timeslot_id}
      },
      { $pull: {timeslots: timeslot_id }} ,function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        doc ? console.log("Removed this timeslot from user!") : console.log("Timeslot not in this user!");
      }));

      let events = result.events;
      events.forEach(event =>
        Event.findOneAndUpdate({
          _id: event_id,
          timeslots: {$eq: timeslot_id}
        },
        { $pull: {timeslots: timeslot_id }} ,function(err, doc){
          if(err){
              console.log("Something wrong when updating data!");
          }
          doc ? console.log("Removed this timeslot from event!") : console.log("Timeslot not in this event!");
        }));

      Timeslot.findOneAndDelete( {_id: timeslot_id}  ).then((result) => {
        res.status(200).json({
          success: true,
          msg: "Congrats, timeslot_id " + result.timeslot_id + " is deleted and removed from each user"
      });
      }) 

  });
    
});


module.exports = router;



