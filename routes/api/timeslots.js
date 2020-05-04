const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/settings').secret;
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
      if (!event_id || !timeslots) {
        return res.status(200).json({
            success: false,
            msg: "Timeslots creation failed, there are missing fields."
        });
      }
      const user_id = decoded._id;
      Event.findOne( {_id: event_id}  ).then((result) => {
        if(!result){
          return res.status(200).json({
            success: false,
            msg: "Event not found!"
          });
        }
        //delete timeslots if exist to create new updated
        Timeslot.deleteMany({ event: event_id, user: user_id }, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("timeslots deleted");
          }
          User.findOne({_id: user_id}).then(function(user){
            let userTZ = user.TZ;
            timeslots.forEach(timeslot => {
              timeslot.forEach(tsContent => {
                let day = timeslot[0];
                if(tsContent != day){
                  //change timeslot to GMT
                  tsContent = parseInt(tsContent) - userTZ;
                  if(tsContent < 0){
                    let dateDay = new Date(day);
                    let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
                    day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
                    tsContent = tsContent + 24;
                  }
                  if(tsContent > 23){
                    let dateDay = new Date(day);
                    let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
                    day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
                    tsContent = tsContent - 24;
                  }
                  let newTimeslot = new Timeslot({
                    user: user_id,
                    event: result._id,
                    day: day,
                    time: tsContent,
                  });
                  newTimeslot.save().then(timeslot => {
                    console.log(`Congrats, timeslot created with the timeslot_id of ${timeslot.id} !`);  // + timeslot + " created");
                  });
                }
              });      
            });
          });
        });
        res.status(200).json({
          success: true,
          msg: "Congrats, timeslots created!"
        });
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
  Timeslot.findOneAndDelete( {_id: timeslot_id}  ).then((result) => {
    if(!result){
      return res.status(200).json({
        success: false,
        msg: "Timeslot not found!"
      });
    }
      res.status(200).json({
        success: true,
        msg: "Congrats, timeslot_id " + result._id + " is deleted"
      });
  });
    
});


module.exports = router;



