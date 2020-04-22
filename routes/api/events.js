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
const { writeFileSync } = require('fs');
const fs = require('fs')
const ics = require('ics');

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

      if (!title || !details || !color || !possibleDays) {
        return res.status(200).json({
            success: false,
            msg: "Event creation failed, there are missing fields."
        });
    }

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

router.get('/show/:id', function(req, res)  {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

      let event_id = req.params.id;
      Event.findOne( {_id: event_id}  ).populate({path: 'users', populate: { path: 'users' }, select: 'username'}).then((result) => {
        if (!result) {
          return res.status(200).json({
            success: false,
            msg: "Event not found."
          });
        }
        let number_users = result.users.length;

        Timeslot.find({event:event_id}).then((timeslots) => {
          //find the advisable timeslots
          let advisable_timeslots = [];
          //find the advisable timeslots only for two or more users
          if(number_users > 1 && Object.keys(timeslots).length != 0){
            let candidate_timeslots = [];
            for(let i=0; i<timeslots.length; i++) {
              candidate_timeslots.push(timeslots[i]["day"] + 'T' + timeslots[i]["time"] + 'C' + 1); 
            }
            for (let i = 0; i < candidate_timeslots.length; i++) { 
              for (let j = i + 1 ; j < candidate_timeslots.length; j++) {
                if (candidate_timeslots[i] == candidate_timeslots[j] && i != j) { 
                  candidate_timeslots[j] = candidate_timeslots[j].replace(/.$/, function(i) { return parseInt(i) + 1; });
                  //get count from candidate timeslot and check if is equal to number of users
                  if(parseInt(candidate_timeslots[j].slice(-1)) == number_users){
                    console.log(`matched one: ${candidate_timeslots[j]}`);
                    advisable_timeslots.push(candidate_timeslots[j]);
                    advisable_timeslots.forEach(timeslot => timeslot.slice(-2). replace("T", " "));
                    console.log(`advisable_timeslots: ${advisable_timeslots}`);
                  }  
                } 
              } 
            }
            if(advisable_timeslots.length == 0){
              advisable_timeslots = "Still no advisable timeslots";
            }
          }
          else{
            Object.keys(timeslots).length != 0 ? advisable_timeslots = "Cannot advise timeslots for only one user" : advisable_timeslots = "No timeslots inserted yet";
          }
          res.status(200).send([result, timeslots, advisable_timeslots]);
        });
      });  
  }); 
});

/**
 * @route GET api/events/download
 * @desc Download ics file for event
 * @access Public
 */

router.get('/download/:id', function(req, res)  {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

      let event_id = req.params.id;
      Event.findOne( {_id: event_id}  ).then((result) => {
        if (!result) {
          return res.status(200).json({
            success: false,
            msg: "Event not found."
          });
        }
        const filename = result.title.replace(/\s/g, '') + 
        //'_' + result.start.getFullYear() + (result.start.getMonth()+1) + result.start.getDate() +'T'+ result.start.getHours() +
        '_' + req.params.id;
        
        return res.download(filename + '.ics');
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
          msg: "User is not the creator, cannot remove users!"
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
        if(result.users[0].toString(2) == doc._id.toString(2)){
          return res.status(200).json({
            success: false,
            msg: "User is the creator, cannot remove himself! Can always delete the event"
          });
        }
        else{
          console.log("enters");
          Timeslot.deleteMany({ event: event_id, user: user_id }, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
            }
          });
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
        } 
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
    params, {new: true} ,function(err, doc){
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
      if(doc.scheduled == true && params.scheduled == 'true'){
        console.log("We should send emails and/or create ics file for download");
        let users_data = [];
        User.find({
          _id: { $in: doc.users }
      }
      , function(err, users){
          users.forEach(function(user) { 
              users_data.push({name: user.name, email: user.email});
          });
        let hours = Math.abs(doc.end - doc.start) / 36e5;
        let hourStart = doc.start.getHours() - decoded.TZ;
        let day = doc.start.getDate();
        if(hourStart < 0){
          let dateDay = new Date(doc.start.getFullYear() + '-' + (doc.start.getMonth()+1) + '-' + doc.start.getDate());
          let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
          day = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + (newDate.getDate()); 
          day = day.slice(-2);
          hourStart = hourStart + 24;
        }
        if(hourStart > 23){
          let dateDay = new Date(doc.start.getFullYear() + '-' + (doc.start.getMonth()+1) + '-' + doc.start.getDate());
          let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
          day = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + (newDate.getDate()); 
          day = day.slice(-2);
          hourStart = hourStart - 24;
        }
        const event = {
          start: [doc.start.getFullYear(), (doc.start.getMonth()+1), day, parseInt(hourStart), doc.start.getMinutes() ],
          duration: { hours: hours, minutes: 0 },
          title: doc.title,
          description: doc.description,
          status: 'CONFIRMED',
          busyStatus: 'BUSY',
          organizer: { name: decoded.name, email: decoded.email },
          attendees: users_data,
          productId: 'ChinguTime'
        }
        ics.createEvent(event, (error, value) => {
          if (error) {
            console.log(error)
            return
          }
          const filename = doc.title.replace(/\s/g, '') + 
          //'_' + doc.start.getFullYear() + (doc.start.getMonth()+1) + doc.start.getDate() +'T'+ doc.start.getHours() + 
          '_' + params.event_id;
          writeFileSync(filename + '.ics', value);
        });
        console.log("Congrats, event " + params.event_id + " is updated, scheduled event! Here you have you ics file.");
        const filename = doc.title.replace(/\s/g, '') + 
        //'_' + doc.start.getFullYear() + (doc.start.getMonth()+1) + doc.start.getDate() +'T'+ doc.start.getHours() + 
        '_' + params.event_id;
        return res.download(filename + '.ics');
      });
      }
      else{
        return res.status(200).json({
          success: true,
          msg: "Congrats, event " + params.event_id + " is updated "
        });
      } 
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
    Event.findOne( {_id: event_id}  ).then((result) => {
      if(!result){
        return res.status(200).json({
          success: false,
          msg: "Event not found!"
        });
      }
      
      //or if the event is scheduled and older than a week => still to do!
      //const today = Date.now();
      //today.setDate(today.getDate()-7);
      /*if(result.scheduled == true && result.start < today){
        return res.status(200).json({
          success: false,
          msg: "User is not the creator, cannot delete event!"
        });
      }*/

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

        //still has to check if is already schedule, if so, delete ics file
        const filename = result.title.replace(/\s/g, '') + 
        //'_' + result.start.getFullYear() + (result.start.getMonth()+1) + result.start.getDate() +'T'+ result.start.getHours() + 
        '_' + req.body.event_id;
       
        //delete the file
        try {
          fs.unlinkSync(filename + '.ics')
          //file removed
        } catch(err) {
          console.error(err)
        }
    });
  });   
});


module.exports = router;
