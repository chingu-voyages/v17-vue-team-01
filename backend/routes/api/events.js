const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../model/User');
const Event = require('../../model/Event');
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
        date,
      } = req.body;
      const user_id = decoded._id;
      let newEvent = new Event({
        users: [user_id],
        title,
        details,
        date,
      }); 

      newEvent.save().then(event => {
          User.findOneAndUpdate({
            _id: user_id
          },
          { events: [event._id] },function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
            console.log("Added this event to user's profile!")
          });
        return res.status(201).json({
            success: true,
            msg: "Congrats, " + event.title + " event is created."
        });
      });    
    });
});

/**
 * @route GET api/events/show
 * @desc Shows event and its users
 * @access Public
 */
router.get('/show', (req, res) => {
    let event_id = req.body.event_id;
    //console.log(event_id);
    Event.find( {_id: event_id}  ).then((result) => {
      res.status(200).send(result);
    })   
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
  
    let user_id;
    User.find( {username: req.body.username} ,function(err, doc){
      console.log(doc);
      
      this.user_id = doc._id;
    });   

    if (!user_id) {
      return res.status(400).json({
        success: false,
        msg: "User not found."
      });
    }

    const username = req.body.username;
    console.log(user_id);
    let event_id = req.body.event_id;
    console.log(event_id);

    User.findOneAndUpdate({
      username: username,
      events: {$ne: event_id}
    },
    { $push: {events: [event_id] }} ,function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }
      doc ? console.log("Added this event to user's profile!") : console.log("Event already in this user!");
    });

    Event.findOneAndUpdate({
      _id: event_id,
      users: {$ne: user_id}
    },
    { $push: {users: [user_id] }},function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }
      doc ? console.log("Added this user to event!") : console.log("User already has this event!");
    });

    return res.status(200).json({
      success: true,
      msg: "Congrats, user " + username + " is in event " + event_id
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
  
    let user_id;
    User.find( {username: req.body.username} ,function(err, doc){
      console.log(doc);
      
      this.user_id = doc._id;
    });   

    if (!user_id) {
      return res.status(200).json({
        success: false,
        msg: "User not found."
      });
    }

    const username = req.body.username;
    console.log(user_id);
    let event_id = req.body.event_id;
    console.log(event_id);

    User.findOneAndUpdate({
      username: username,
      events: {$ne: event_id}
    },
    { $pop: {events: [event_id] }} ,function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }
      doc ? console.log("Removed this event from user's profile!") : console.log("Event not in this user!");
    });

    Event.findOneAndUpdate({
      _id: event_id,
      users: {$ne: user_id}
    },
    { $pop: {users: [user_id] }},function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }
      doc ? console.log("Removed this user from event!") : console.log("User not in this event!");
    });

    return res.status(200).json({
      success: true,
      msg: "Congrats, user " + username + " is removed from event " + event_id
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

    let {
      event_id,
      title,
      details,
      start,
      end
    } = req.body;
    //console.log(event_id);

    Event.findOneAndUpdate({
      _id: event_id,
    },
    { title: title, details: details, start: start, end: end},function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }
      doc ? console.log("Event updated!") : console.log("Nothing to change!");
    });

    return res.status(200).json({
      success: true,
      msg: "Congrats, event " + doc.title + " is updated "
  });
  });   
});

/**
 * @route POST api/events/delete
 * @desc Delete event
 * @access Public
 */
router.post('/delete', (req, res) => {
  let event_id = req.body.event_id;
  //console.log(event_id);
  Event.findOne( {_id: event_id}  ).then((result) => {
    let users = result.users;
    users.forEach(user =>
      User.findOneAndUpdate({
        _id: user._id,
        events: {$ne: event_id}
      },
      { $pop: {events: [event_id] }} ,function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        doc ? console.log("Removed this event from user's profile!") : console.log("Event not in this user!");
      }));
});
  Event.findOneAndDelete( {_id: event_id}  ).then((result) => {
    res.status(200).json({
      success: true,
      msg: "Congrats, event " + result.title + " is deleted and removed from each user"
  });
  })   
});


module.exports = router;