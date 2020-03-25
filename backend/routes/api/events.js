const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../model/User');
const Event = require('../../model/Event');

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
        name,
        details,
        date,
      } = req.body;
      const user_id = decoded._id;
      let newEvent = new Event({
        users: [user_id],
        name,
        details,
        date,
      }); 

      newEvent.save().then(event => {
        return res.status(201).json({
            success: true,
            msg: "Congrats, " + event.title + " event is created."
        });
      });    
    });
});

/**
 * @route GET api/events/show
 * @desc Shows event
 * @access Public
 */
router.get('/show', (req, res) => {
  let event_id = req.body.event_id;
  console.log(event_id);
  Event.find( {_id: event_id}  ).then((result) => {
    res.status(200).send(result);
  })   
});

/**
* @route POST api/events/add
* @desc Adds user to event
* @access Public
*/
router.post('/add', (req, res) => {
  //todo
});


module.exports = router;