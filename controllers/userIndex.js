

var jwt    = 	require('jsonwebtoken'); 			// used to create, sign, and verify tokens

var User   = 	require('../models/user'); 		// get our mongoose model

var express = 	require('express'), 
router = 		express.Router()

var config = 	require('../config'); 				// get our config file


require('./users/GET_email')		(router); 			// get user info by email
require('./users/GET_all')			(router); 			// get all user info

require('./users/POST_authenticate')(router);	// authenticate a user

require('./users/PUT_bbt~email')	(router); 		// update user's bbt info
require('./users/PUT_sign~email')		(router);			// update user sign by email
require('./users/PUT_~email')		(router);			// update user info by email




//routes under /users/ must be verified via token

// route middleware to verify a token
router.use(function(req, res, next) {

	console.log('------apiRoutes.use function to verify token------------');

	//X-ACCESS-TOKEN is the key, we need to give it value of token
	//so it can authenticate us

	//console.log("req.body.token: " + req.body.token);
	console.log("req.headers[x-access-token]: " + req.headers['x-access-token']);
	console.log("req.headers[x-access-email]: " + req.headers['x-access-email']);

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  var email = req.headers['x-access-email'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      
	  if (err) 
	  {
	    return res.json({ success: false, message: 'Failed to authenticate token.' });    
	  } 
	  else 
	  {
	    // if everything is good, save to request for use in other routes
	    req.decoded = decoded;    
	    req.body.email = email;

	    next(); //go on to /api/users...or whereever you route it to.
	  }

    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
  
});


module.exports = router