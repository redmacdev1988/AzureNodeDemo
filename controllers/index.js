var User   = require('../models/user'); // get our mongoose model
var config = require('../config'); // get our config file

var express = require('express')
  , router = express.Router()

//we want to let clients create a user via POST method
require('./POST_createUser')(router); 
require('./GET_')(router); 

//route /users to file users.js
router.use('/users', require('./userIndex'));


module.exports = router;
