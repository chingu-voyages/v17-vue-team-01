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
  
      let timeslots = res.body.timeslots;
      let {
        event_id,
        day,
        time,
      } = req.body;
      const user_id = decoded._id;
      timeslots.forEach(timeslot => {
          let newTimeslot = new Timeslot({
            _id: timeslot_id,
            day,
            time,
          }); 
          newTimeslot.save();
          return res.status(201).json({
            success: true,
            msg: "Congrats, timeslot associated with " + event._id + " and user " + user_id
        });  
      });
      
          
    });   
  });

/**
 * @route GET api/timeslots/show
 * @desc Shows timeslots for event
 * @access Public
 */
router.get('/show', (req, res) => {
    let event_id = req.body.event_id;
    //console.log(event_id);
    Timeslot.find( {event: event_id}  ).then((result) => {
  
      if (!result) {
        return res.status(400).json({
          success: false,
          msg: "Event not found."
        });
      }
      res.status(200).send(result);
    })   
});

module.exports = router;