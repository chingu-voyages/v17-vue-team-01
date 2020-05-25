const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/settings').secret;
const User = require('../../model/User');
const Event = require('../../model/Event');
const { writeFileSync } = require('fs');
const fs = require('fs');
const ics = require('ics');

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post('/register', (req, res) => {
    let {
        name,
        username,
        email,
        password,
        //confirm_password,
        TZ
    } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(200).json({
            success: false,
            msg: "Registration failed, there are missing fields."
        });
    }
    // if (password !== confirm_password) {
    //     return res.status(200).json({
    //         success: false,
    //         msg: "Password do not match."
    //     });
    // }
    // Check for the unique Username
    User.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(200).json({
                success: false,
                msg: "Username is already taken."
            });
        }
        // Check for the Unique Email
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                return res.status(200).json({
                    success: false,
                    msg: "Email is already registered. Did you forget your password?"
                });
            }
            // The data is valid and now we can register the user
            let newUser = new User({
                name,
                username,
                password,
                email,
                TZ
            });
            // Hash the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => {
                        return res.status(201).json({
                            success: true,
                            msg: "Congrats! User is now registered."
                        });
                    });
                });
            });
        });
    });
});

/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            return res.status(200).json({
                success: false,
                msg: "Username not found."
            });
        }
        // If there is user we are now going to compare the password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    TZ: user.TZ,
                }
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`,
                        user: user.username,
                        msg: "Congrats " + user.username + "! You are now logged in. And, your _id is " + user._id
                    });
                })
            } else {
                return res.status(200).json({
                    success: false,
                    msg: "Incorrect password."
                });
            }
        })
    });
});

/**
 * @route GET api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
router.get('/profile', function(req, res) {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
    
    jwt.verify(token, key, function(err, decoded) {
      if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
      User.findOne({
        _id: decoded._id
      }, { name: 1, username: 1, email: 1, TZ: 1, events: 1 })
      .populate({path: 'events', populate: { path: 'events' }, select: ['title', 'scheduled']})
      .then((result) => {
        if (!result) {
            return res.status(200).json({
              success: false,
              msg: "User not found."
            });
          }
        return res.status(200).send(result);
        })
    })
  });

/**
 * @route POST api/users/update
 * @desc Update User
 * @access Public
 */
router.post('/update', (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
    
    jwt.verify(token, key, function(err, decoded) {
      if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
  
      let params = {};
      if (Object.keys(req.body).length == 2 && (req.body.email == null && req.body.username == null)) {
        return res.status(200).json({
            success: false,
            msg: "Update failed, there are no fields to update."
        });
      }
      for(let prop in req.body) if(req.body[prop]) params[prop] = req.body[prop];
      if(req.body.TZ == 0) params.TZ = 0;
      // Check for the Unique Email or unique username
      User.find({$or:[{email: params.email},{username: params.username}]}).then(user => {
        if (user.length != 0) {
            return res.status(200).json({
                success: false,
                msg: "This email/username is already in use."
            });
        }
        else{
            User.findOneAndUpdate({
                _id: decoded._id,
            },
            params,function(err, doc){
                // Hash the password
                if(params.password){
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(params.password, salt, (err, hash) => {
                            if (err) throw err;
                            params.password = hash;
                            doc.password = hash;
                            doc.save();
                        });
                    });
                }
                if(err){
                    console.log("Something wrong when updating!");
                }
                doc ? console.log("Updated!") : console.log("User not found!");
                return res.status(200).json({
                    success: true,
                    msg: "Congrats, user is updated!"  
                });
            });
        } 
    });
    });   
  });

/**
 * @route GET api/users/export
 * @desc Export calendar
 * @access Public
 */

router.get('/export', function(req, res)  {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ success: false, message: 'No token was provided.' });
    
    jwt.verify(token, key, function(err, decoded) {
      if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate the token.' });

      
        User.findOne( {_id: decoded._id}  ).then((result) => {
          if (!result) {
            return res.status(200).json({
              success: false,
              msg: "User not found."
            });
          }
          let events_data = [];
            Event.find({
              _id: { $in: result.events }
              }
              , function(err, events){
                events.forEach(function(event) { 
                    if(event.scheduled == true){
                        /*User.find({
                        _id: { $in: event.users }
                        }
                        , function(err, users){
                            users.forEach(function(user) { 
                                users_data.push({name: user.name, email: user.email});
                            });*/
                            let hours = Math.abs(event.end - event.start) / 36e5;
                            let hourStart = event.start.getHours();// - decoded.TZ;
                            let day = event.start.getDate();
                            let eventCal = {
                                start: [event.start.getFullYear(), (event.start.getMonth()+1), day, parseInt(hourStart), event.start.getMinutes() ],
                                duration: { hours: hours, minutes: 0 },
                                title: event.title,
                                description: event.details,
                                status: 'CONFIRMED',
                                busyStatus: 'BUSY',
                                //attendees: users_data,
                                productId: 'Chingu Time'
                            }
                            events_data.push(eventCal);
                        //}); 
                    }
                });
              console.log(events_data);
              ics.createEvents(
                (events_data), (error, value) => {
              if (error) {
                console.log(error)
                return
              }
              const filename = 'calendar_export' + result.username;
              writeFileSync(filename + '.ics', value);
              console.log("ics file to download with calendar export for user " + result.username);
              return res.download(filename + '.ics');
            });
          });
        });  
    }); 
  });

/**
 * @route GET api/users/logout
 * @desc Login out the User, it is not needed as the logging out is done in the client side
 * nonetheless, the endpoint is created
 * @access Public
 */
router.get('/logout', function(req, res) {
    res.status(200).send({ success: true, token: null });
  });

module.exports = router;