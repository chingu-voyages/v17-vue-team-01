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
const { writeFileSync } = require('fs');
const fs = require('fs');
const ics = require('ics');

// sendgrid setting
const path = require('path');
require('dotenv').config({ path: '../../.env' });
require('dotenv').config({path: __dirname+'../../.env'});
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
            msg: "Creating an event has failed because there are some missing fields."
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
                console.log("Something is wrong when updating data!");
            }
            console.log("This event has been added to the user's profile!")
          });
        return res.status(201).json({
            success: true,
            msg: "Congrats, " + event.title + " is created under the event_id of " + event._id
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
  if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

      let event_id = req.params.id;
      Event.findOne( {_id: event_id}  ).populate({path: 'users', populate: { path: 'users' }, select: ['username', 'TZ'] }).then((result) => {
        if (!result) {
          return res.status(200).json({
            success: false,
            msg: "The event was not found."
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
              advisable_timeslots = "Advisable timeslots are not available. They will be generated once there are some timeslots selected by all the participants";
            }
          }
          else{
            Object.keys(timeslots).length != 0 ? advisable_timeslots = "Cannot advise timeslots for only one user" : advisable_timeslots = "No timeslots is inserted yet";
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
  if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate the token.' });

      let event_id = req.params.id;
      Event.findOne( {_id: event_id}  ).then((result) => {
        if (!result) {
          return res.status(200).json({
            success: false,
            msg: "Event not found."
          });
        }
        const filename = result.title.replace(/\s/g, '') + '_' + req.params.id;
        if(!fs.existsSync(filename + '.ics')){
          let users_data = [];
          User.find({
            _id: { $in: result.users }
        }
        , function(err, users){
            users.forEach(function(user) { 
                users_data.push({name: user.name, email: user.email});
            });
          let hours = Math.abs(result.end - result.start) / 36e5;
          let hourStart = result.start.getHours();// - decoded.TZ;
          let day = result.start.getDate();
          const event = {
            start: [result.start.getFullYear(), (result.start.getMonth()+1), day, parseInt(hourStart), result.start.getMinutes() ],
            duration: { hours: hours, minutes: 0 },
            title: result.title,
            description: result.description,
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            organizer: { name: decoded.name, email: decoded.email },
            attendees: users_data,
            productId: 'Chingu Time'
          }
          ics.createEvent(event, (error, value) => {
            if (error) {
              console.log(error)
              return
            }
            const filename = result.title.replace(/\s/g, '') + '_' + event_id;
            writeFileSync(filename + '.ics', value);

            console.log(event_id + " ics file to download! Here, you have your ics file.");
            return res.download(filename + '.ics');
          });
        });
        }
        else{
          console.log(event_id + " ics file to download! Here, you have your ics file.");
          return res.download(filename + '.ics');
        }
      });  
  }); 
});

/**
 * @route GET api/events/send
 * @desc Send email for event
 * @access Private
 */

router.get('/send/:id', function(req, res)  {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate the token.' });

      let event_id = req.params.id;
      Event.findOne( {_id: event_id}  ).then((result) => {
        if (!result) {
          return res.status(200).json({
            success: false,
            msg: "Event not found."
          });
        }
        const filename = result.title.replace(/\s/g, '') + '_' + req.params.id;
          // let users_data = [];
          User.find({
            _id: { $in: result.users }
        }
        , function(err, users){
          let users_data = [];
          console.log(`users: ${ users }`)
            users.forEach(function(user) { 
                users_data.push({name: user.name, email: user.email});
            });
          let hours = Math.abs(result.end - result.start) / 36e5;
          let hourStart = result.start.getHours();// - decoded.TZ;
          let day = result.start.getDate();

          // const event = {
          //   start: [result.start.getFullYear(), (result.start.getMonth()+1), day, parseInt(hourStart), result.start.getMinutes() ],
          //   duration: { hours: hours, minutes: 0 },
          //   title: result.title,
          //   description: result.description,
          //   status: 'CONFIRMED',
          //   busyStatus: 'BUSY',
          //   organizer: { name: decoded.name, email: decoded.email },
          //   // attendees: users_data,
          //   productId: 'Chingu Time'
          // }
          
          let toList = [];
            users.forEach(function(user) {
           toList.push(user.email);   
          });

          sgMail.send({
            isMultiple: true,
            to: toList,
            from: 'chingutime@gmail.com',
            subject: result.title,
            html: `'<h3>${result.details}: ${result.start.getMonth()+1}-${day}-${result.start.getFullYear()}${hourStart}:00 for ${hours} hour(s)</h3>'`
          }, function(err, msg) {
            if(err) {
              return res.send(`${err} error occurred!`);
            }
            console.log('Email sent!');
            res.send(msg); 
          });
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
  if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate the token.' });
    
    console.log(req.body.username);

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isEmail = re.test(String(req.body.username).toLowerCase());

    if(!isEmail){
      User.findOne( {username: req.body.username} ,function(err, doc){
        if (!doc) {
          return res.status(200).json({
            success: false,
            msg: "User with this username not found."
          });
        };
        const user_id = doc._id;
        const username = req.body.username;
        const event_id = req.body.event_id;
    
        User.findOneAndUpdate({
          username: username,
          events: {$ne: event_id}
        },
        { $push: {events: [event_id] }} ,function(err, user){
          if(err){
              console.log("Something went wrong when updating data!");
          }
          user ? console.log("This event was added to the user's event(s)!") : console.log("This event is already in this user's event(s)!");
          
          if(doc){
            Event.findOneAndUpdate({
              _id: event_id,
              users: {$ne: user_id}
            },
            { $push: {users: user_id }},function(err, event){
              if(err){
                  console.log("Something went wrong when updating data!");
              }
              event ? console.log("This user was added to the event!") : console.log("The user is already part of this event!");
              if(user.emailOpt == true){
                sgMail.send({
                  to: user.email,
                  from: 'chingutime@gmail.com',
                  subject: 'You have been added to ' + event.title,
                  html: `<h3>You've been added to ` + event.title + ` on <a href="https://chingutime.netlify.app/#/">Chingu Time</a>! <br>Want to add your timeslots? Continue <a href="https://chingutime.netlify.app/#/event/`+ event_id+`">HERE</a></h3>`
                }, function(err, msg) {
                  if(err) {
                    return res.status(200).json({
                      success: false,
                      msg: "The use was added, but could not send the email with an error: " + err
                    });
                  }
                  console.log('Email sent!');
                });
              }
            });
            return res.status(200).json({
              success: true,
              msg: "Congrats, user with username " + username + " is added to event with id: " + event_id + ". An email was sent out!"
            });
          }
          else{
            return res.status(200).json({
              success: false,
              msg: "The user is already part of this event!"
            });
          }
        });
      });
    }
    else{
      User.findOne( {email: req.body.username} ,function(err, doc){
        if (!doc) {
          return res.status(200).json({
            success: false,
            msg: "User with this email not found."
          });
        };
        const user_id = doc._id;
        const email = req.body.username;
        const event_id = req.body.event_id;
    
        User.findOneAndUpdate({
          email: email,
          events: {$ne: event_id}
        },
        { $push: {events: [event_id] }} ,function(err, user){
          if(err){
              console.log("Something went wrong when updating data!");
          }
          user ? console.log("This event was added to the user's event(s)!") : console.log("This event is already in this user's event(s)!");
          
          if(doc){
            Event.findOneAndUpdate({
              _id: event_id,
              users: {$ne: user_id}
            },
            { $push: {users: user_id }},function(err, event){
              if(err){
                  console.log("Something went wrong when updating data!");
              }
              event ? console.log("This user was added to the event!") : console.log("The user is already part of this event!");
            
              sgMail.send({
                to: user.email,
                from: 'chingutime@gmail.com',
                subject: 'You have been added to ' + event.title,
                html: `<h3>You've been added to ` + event.title + ` on <a href="https://chingutime.netlify.app/#/">Chingu Time</a>! <br>Want to add your timeslots? Continue <a href="https://chingutime.netlify.app/#/event/`+ event_id+`">HERE</a></h3>`
              }, function(err, msg) {
                if(err) {
                  return res.status(200).json({
                    success: false,
                    msg: "The use was added, but could not send the email with an error: " + err
                  });
                }
                console.log('Email sent!');
              });
            });
            return res.status(200).json({
              success: true,
              msg: "Congrats, user with email " + email + " is added to event with id: " + event_id + ". An email was sent out!"
            });
          }
          else{
            return res.status(200).json({
              success: false,
              msg: "The user is already part of this event!"
            });
          }
        });
      });
    }
  });   
});

/**
 * @route POST api/events/remove
 * @desc Removes user from event, getting user by username
 * @access Public
 */
router.post('/remove', (req, res) => {
    
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate the token.' });
  
    let event_id = req.body.event_id;
    //let user_id = decoded._id;
    Event.findOne( {_id: event_id}  ).then((result) => {
      if(!result){
        return res.status(200).json({
          success: false,
          msg: "Event was not found!"
        });
      }
      //check if it is the first user of the event
      /*if(result.users[0] != user_id){
        return res.status(200).json({
          success: false,
          msg: "The user is not the creator, so s/he cannot remove the users from the event!"
        });
      }*/
      User.findOne( {username: req.body.username} ,function(err, doc){
        if (!doc) {
          return res.status(200).json({
            success: false,
            msg: "The user was not found."
          });
        }
        const user_id = doc._id;
        const username = req.body.username;
        const event_id = req.body.event_id;
        if(result.users[0].toString(2) == doc._id.toString(2)){
          return res.status(200).json({
            success: false,
            msg: "The user is the creator, so s/he cannot remove himself/herself from the event! You can always delete the event instead."
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
                console.log("Something went wrong when updating data!");
            }
            doc ? console.log("This event was removed from the user's profile!") : console.log("The event is not in this user's event(s)!");
            if(doc){
              Event.findOneAndUpdate({
                _id: event_id,
                users: {$eq: user_id}
              },
              { $pull: {users: user_id }} ,function(err, doc){
                if(err){
                    console.log("Something went wrong when updating data!");
                }
                doc ? console.log("This user was removed from event!") : console.log("The user is not part of this event!");
        
              });
              return res.status(200).json({
                success: true,
                msg: "Congrats, " + username + " is removed from the event of " + event_id
              });
            }
            else{
              return res.status(200).json({
                success: false,
                msg: "The user is not part of this event!"
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
  if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
  
  jwt.verify(token, key, function(err, decoded) {
    if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate the token.' });

    let params = {};
    for(let prop in req.body) if(req.body[prop]) params[prop] = req.body[prop];

    if(req.body.scheduled == 'false'){
      params.start = null;
      params.end = null;
    }
    Event.findOneAndUpdate({
      _id: params.event_id,
    },
    params, {new: true} ,function(err, doc){
      if(!doc){
        return res.status(200).json({
          success: false,
          msg: "Event was not found!"
      });
      }
      if(err){
          console.log("Something went wrong when updating data!");
      }
      doc ? console.log("The event has been updated!") : console.log("Nothing to change!");

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
        let hourStart = doc.start.getHours();// - decoded.TZ;
        let day = doc.start.getDate();
        const event = {
          start: [doc.start.getFullYear(), (doc.start.getMonth()+1), day, parseInt(hourStart), doc.start.getMinutes() ],
          duration: { hours: hours, minutes: 0 },
          title: doc.title,
          description: doc.description,
          status: 'CONFIRMED',
          busyStatus: 'BUSY',
          organizer: { name: decoded.name, email: decoded.email },
          attendees: users_data,
          productId: 'Chingu Time'
        }
        ics.createEvent(event, (error, value) => {
          if (error) {
            console.log(error)
            return
          }
          const filename = doc.title.replace(/\s/g, '') + '_' + params.event_id;
          writeFileSync(filename + '.ics', value);
        });
          let toList = [];
          users.forEach(function(user) {
            if(user.emailOpt == true){
              toList.push(user.email);   
            }
          });
          const filename = doc.title.replace(/\s/g, '') + '_' + params.event_id;
          let attachment = fs.readFileSync(filename + '.ics').toString("base64");
          //console.log(toList);
          sgMail.send({
            isMultiple: true,
            to: toList,
            from: 'chingutime@gmail.com',
            subject: doc.title + ' scheduled!',
            html: `<h3>Event `+ doc.title +` from <a href="https://chingutime.netlify.app/#/">Chingu Time</a> in which you are a participant is now scheduled! <br>You can find the attached ics file for the calendar update.</h3>`,
              attachments: [
              {
                content: attachment,
                filename: filename + '.ics',
                type: "application/ics",
                disposition: "attachment"
              }
            ]
          }, function(err, msg) {
            if(err) {
              //console.log(err)
              //console.log(msg)
              return res.status(200).json({
                success: false,
                msg: "The event has been scheduled but couldn't send the email with an error: " + err
              });
            }
            console.log('Email sent!');
          });

        console.log("Congrats, " + params.event_id + " is updated as a scheduled event! Here, you have your ics file.");
        
        return res.download(filename + '.ics');
      });
      }
      else{
        return res.status(200).json({
          success: true,
          msg: "Congrats, " + params.event_id + " has been updated."
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
          msg: "Event was not found!"
        });
      }

      //check if it is the first user of the event
      if(result.users[0] != user_id){
        return res.status(200).json({
          success: false,
          msg: "The user is not the creator, so s/he cannot delete the event!"
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
              console.log("Something went wrong when updating data!");
          }
          doc ? console.log("This event was removed from user's event(s)!") : console.log("The event is not in this user's event(s)!");
        }));
        Event.findOneAndDelete( {_id: event_id}  ).then((result) => {
          res.status(200).json({
            success: true,
            msg: "Congrats, " + result.title + " has been deleted and removed from each user's event(s)."
        });
        }) 

        const filename = result.title.replace(/\s/g, '') + '_' + req.body.event_id;
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
