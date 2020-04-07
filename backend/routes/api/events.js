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
 * @route POST api/events/create
 * @desc Create an event
 * @access Public
 */
router.post('/create', (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
    
    jwt.verify(token, key, function(err, decoded) {
      if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
    
      let {
        title,
        details,
        color,
        possibleDays,
      } = req.body;
      const user_id = decoded._id;
      let newEvent = new Event({
        users: [user_id],
        title,
        details,
        color,
        possibleDays
      }); 

      newEvent.save().then(event => {
          User.findOneAndUpdate({
            _id: user_id
          },
          { $push: {events: [event._id]} },function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
            console.log("Added this event to user's profile!")
          });
        return res.status(201).json({
            success: true,
            msg: "Congrats, " + event.title + " event is created under event_id of " + event._id
        });
      });    
    });
});

/**
 * @route GET api/events/show
 * @desc Shows event and its users
 * @access Public
 */
router.get('/show/:id', (req, res) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

      let event_id = req.params.id;
      //console.log(event_id);
      Event.findOne( {_id: event_id}  ).then((result) => {

        if (!result) {
          return res.status(200).json({
            success: false,
            msg: "Event not found."
          });
        }

        Timeslot.find({event:event_id}).then((possible_timeslots) => {
          console.log(`event info: ${result}`);
          console.log(`possible_timeslots: ${possible_timeslots}`);
          //find the advisable timeslots
          let advisable_timeslots = [];
          candidate_timeslots = [];
          for(let i=0; i<possible_timeslots.length; i++) {
            candidate_timeslots.push([possible_timeslots[i]["day"] + possible_timeslots[i]["time"]]); 
          }
          console.log(`possible_timeslots for days and times: ${candidate_timeslots}`);
          for (let i = 0; i < candidate_timeslots.length; i++) { 
            for (let j = i + 1 ; j < candidate_timeslots.length; j++) {
               if (candidate_timeslots[i].equals(candidate_timeslots[j])) { 
                 advisable_timeslots.push(names[j]) } } }

          console.log( `advisable_timeslots: ${advisable_timeslots}`);
          res.status(200).send([result, possible_timeslots, advisable_timeslots]);
          
        });
        
      });      
  }); 
});

/**
 * @route POST api/events/add
 * @desc Adds user to event, getting user by username
 * @access Public
 */
router.post('/add', (req, res) => {
    
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
  
    User.findOne( {username: req.body.username} ,function(err, doc){
      
      if (!doc) {
        return res.status(200).json({
          success: false,
          msg: "User not found."
        });
      };
      const user_id = doc._id;
      const username = req.body.username;
      const event_id = req.body.event_id;
  
      User.findOneAndUpdate({
        username: username,
        events: {$ne: event_id}
      },
      { $push: {events: [event_id] }} ,function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        doc ? console.log("Added this event to user's profile!") : console.log("Event already in this user!");

        if(doc){
          Event.findOneAndUpdate({
            _id: event_id,
            users: {$ne: user_id}
          },
          { $push: {users: user_id }},function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
            doc ? console.log("Added this user to event!") : console.log("User already has this event!");
          });

          return res.status(200).json({
            success: true,
            msg: "Congrats, user " + username + " is in event " + event_id
          });
        }
        else{
          return res.status(200).json({
            success: false,
            msg: "User already has this event!"
          });
        }
      });
  
      
  
      
    });
    });   
    

    
});

/**
 * @route POST api/events/remove
 * @desc Removes user from event, getting user by username
 * @access Public
 */
router.post('/remove', (req, res) => {
    
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
  
    let event_id = req.body.event_id;
    let user_id = decoded._id;
    console.log(user_id);
    Event.findOne( {_id: event_id}  ).then((result) => {
      if(!result){
        return res.status(200).json({
          success: false,
          msg: "Event not found!"
        });
      }
      //check if it is the first user of the event
      if(result.users[0] != user_id){
        return res.status(200).json({
          success: false,
          msg: "User is not the creator, cannot delete event!"
        });
      }

      User.findOne( {username: req.body.username} ,function(err, doc){
      
        if (!doc) {
          return res.status(200).json({
            success: false,
            msg: "User not found."
          });
        }
        const user_id = doc._id;
        const username = req.body.username;
        const event_id = req.body.event_id;
  
        User.findOneAndUpdate({
          username: username,
          events: {$eq: event_id}
        },
        { $pull: {events: event_id }},function(err, doc){
          if(err){
              console.log("Something wrong when updating data!");
          }
          doc ? console.log("Removed this event from user's profile!") : console.log("Event not in this user!");
  
          if(doc){
  
            Event.findOneAndUpdate({
              _id: event_id,
              users: {$eq: user_id}
            },
            { $pull: {users: user_id }} ,function(err, doc){
              if(err){
                  console.log("Something wrong when updating data!");
              }
              doc ? console.log("Removed this user from event!") : console.log("User not in this event!");
      
            });
  
            return res.status(200).json({
              success: true,
              msg: "Congrats, user " + username + " is removed from event " + event_id
            });
          }
          else{
            return res.status(200).json({
              success: false,
              msg: "User not in this event!"
            });
          }
        });
    
        
    
        
      });
      });   





    });
    

    
});

/**
 * @route POST api/events/update
 * @desc Update event
 * @access Public
 */
router.post('/update', (req, res) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

    let params = {};

    for(let prop in req.body) if(req.body[prop]) params[prop] = req.body[prop];
    Event.findOneAndUpdate({
      _id: params.event_id,
    },
    params ,function(err, doc){
      if(!doc){
        return res.status(200).json({
          success: false,
          msg: "Event not found!"
      });
      }
      
      if(err){
          console.log("Something wrong when updating data!");
      }
      doc ? console.log("Event updated!") : console.log("Nothing to change!");
    
      return res.status(200).json({
        success: true,
        msg: "Congrats, event " + params.event_id + " is updated "
      });
    
    });

    
  });   
});

/**
 * @route POST api/events/delete
 * @desc Delete event
 * @access Public
 */
router.post('/delete', (req, res) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

    let user_id = decoded._id;

    let event_id = req.body.event_id;
    //console.log(event_id);
    Event.findOne( {_id: event_id}  ).then((result) => {
      if(!result){
        return res.status(200).json({
          success: false,
          msg: "Event not found!"
        });
      }
      //check if it is the first user of the event
      if(result.users[0] != user_id){
        return res.status(200).json({
          success: false,
          msg: "User is not the creator, cannot delete event!"
        });
      }

      Timeslot.deleteMany({ event: event_id }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });

      let users = result.users;
      users.forEach(user =>
        User.findOneAndUpdate({
          _id: user._id,
          events: {$eq: event_id}
        },
        { $pull: {events: event_id }} ,function(err, doc){
          if(err){
              console.log("Something wrong when updating data!");
          }
          doc ? console.log("Removed this event from user's profile!") : console.log("Event not in this user!");
        }));

        Event.findOneAndDelete( {_id: event_id}  ).then((result) => {
          res.status(200).json({
            success: true,
            msg: "Congrats, event " + result.title + " is deleted and removed from each user"
        });
        }) 

    });
  }); 
    
});


module.exports = router;