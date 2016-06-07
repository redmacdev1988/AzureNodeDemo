

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var User   = require('./models/user'); // get our mongoose model

var express = require('express')
  , apiRoutes = express.Router()


// API ROUTES -------------------


//data to change is stored in x-www-form-urlencoded POST key/value
// route to authenticate a user (POST http://localhost:8080/api/bbt/:user_email)
apiRoutes.put('/bbt/:user_email', function(req, res) {

	console.log('email: ' + req.params.user_email);
	console.log('req.body.date: ' + req.body.date); // 7/14/2015
	console.log('req.body.recordings: ' + req.body.recordings);

	User.findOne( { email:req.params.user_email }, function(err,user){

		if (err) throw err;

	    if (!user) 
	    {
	    	res.json({ success: false, message: 'User not found.' });
	    } 
	    else if (user) 
	    {

	    	//display all dates
	    	var allRecordings = user.bbtRecordings;

	    	var numOfRecordings = allRecordings.length;
	    	console.log('user ' + user.email + ' found! we looking for req.body.date: ' + req.body.date);

	    	console.log('there are ' + numOfRecordings + ' date(s) with bbt recordings in the db');
	    	
	    	if (numOfRecordings > 0) { //then we update the database

		    	var newBBTDay = {
		    		date: req.body.date,
		    		recordings: req.body.recordings
		    	};

		    	
	    		var lastElement = allRecordings[allRecordings.length-1]

	    		//find if there exist a date already
	    		if(req.body.date===lastElement.date) {
	    			console.log('bbt recordings with same date exists in db...we need to replace it with new');
	    			console.log('so we pop the last element from allRecordings');
	    			allRecordings.pop();
	    		}
	    			
	    		console.log('insert the new bbt day');
	    		//we insert the element
	    		user.bbtRecordings.push(newBBTDay);
	   			console.log('save the update into our database');

	    		user.save(function(err){

		    		if(err) {
		    			res.send(err);
		    		}
		    		else {
		    			res.json({message:'updated key'});
		    		}
		    	});
	    	}//if num of recordings > 0

	    } //if else
 
	}); //findOne

});

//data to change is stored in x-www-form-urlencoded POST key/value
// route to authenticate a user (POST http://localhost:8080/api/:user_email)
apiRoutes.put('/:user_email', function(req, res) {

	console.log('email: ' + req.params.user_email 
		+ ', update modelKey (' + req.body.modelKey + ') to value: ' + req.body.modelValue);

	//change the model's value by its key
	User.findOne({
    	email: req.params.user_email
  
  	}, function(err, user) {

	    if (err) throw err;

	    if (!user) 
	    {
	    	res.json({ success: false, message: 'User not found.' });
	    } 
	    else if (user) 
	    {
	    	//found valid user, let's change the value

	    	console.log('user[' + req.body.modelKey + ']: ' + user[req.body.modelKey]);
	    	user[req.body.modelKey] = req.body.modelValue;

	    	user.save(function(err){
	    		if(err) 
	    			res.send(err);
	    		else
	    			res.json({message:'updated key' + req.body.modelKey 
	    				+ ' with value ' + req.body.modelValue});
	    	});
	    } // if/else
	}); // findOne
}); //put

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

	console.log('email value: ' + req.body.email);
	console.log('password value: ' + req.body.password);


	//User is model object made by mongoose
  //  mongoose's findOne function to find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {


    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. Email not found.' });
    } else if (user) {

    	//user with that name is returned...we just have to check if the pwds match

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } 
      else {

      	console.log('email found, and password is correct');
        // if user is found and password is right
        
        //You can give each user a JWT token that will last a minute
        // and when a request with expired token arrives, you simply issue them a new one.


        // create a token, jsonwebtoken to create the token.
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 2 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});






// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

	console.log('------apiRoutes.use function to verify token------------');

	//X-ACCESS-TOKEN is the key, we need to give it value of token
	//so it can authenticate us

	//console.log("req.body.token: " + req.body.token);
	console.log("req.headers[x-access-token]: " + req.headers['x-access-token']);
	console.log("req.headers[x-access-email]: " + req.headers['x-access-email']);

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  var email = req.headers['x-access-email'];

  console.log('value of email: ' + email);
  console.log('value of token: ' + token);


  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      
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



// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users/:user_email', function(req, res) {

	console.log('req.params.user_email: ' + req.params.user_email);
  	
  	User.findOne({
    	email: req.params.user_email
	}, function(err, user) {

		console.log('user found: ' + user.email);
		res.json(user);

	});

});  


// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {

	console.log('authenticated for: ' + req.body.email + ", now let's find the users and return it.");

  	User.find({}, function(err, users) {
	    res.json(users);
	});

});   


function createFlowDaysArray(datesArray)
{
	var flowDaysArray = [];

	if(datesArray !== undefined) {
	     for ( var i = 0; i < datesArray.length; i++) {
	     	//create flowDates object, and put these strings in

	     	console.log('flow date ' + i + ': ' + datesArray[i].beginDate + ' to ' + datesArray[i].endDate);
	     	//create flow day object
	     	var flowDay = { startDate: datesArray[i].beginDate , 
	     					endDate: datesArray[i].endDate };

	     	flowDaysArray.push(flowDay);
	     }
	}

	return flowDaysArray;
}


function createBBTObject(arrayOfDays)
{
	var allBBTDays = []; //contains all bbt days

	if(arrayOfDays !==undefined) {

		//go through each day
		for (var i = 0; i < arrayOfDays.length; i++)
		{
			//get a single day of BBTs
			var date = arrayOfDays[i].date;
			console.log('processing recordings for date is: ' + date);

			var recordings = arrayOfDays[i].recordings;
			var numOfRecordings = recordings.length;
			console.log('there are ' + numOfRecordings + ' recordings for ' + date);

			var arrayOfBBTs = []; //an array of BBTs for this day

			//for this particular day, let's collect array of time and temps
			for ( var j = 0; j < numOfRecordings; j++) {

				var aRecord = recordings[j];

				console.log('------> time: '  + aRecord.time);
				console.log('------> temperature: '  + aRecord.temperature);


				var timeTempSchemaVar = {
					time: aRecord.time,
					temperature: aRecord.temperature
				};

				arrayOfBBTs.push(timeTempSchemaVar);
			}

			//in the end of, for a day, we have an array of {time, temps}
			var aDay = {
				date: date,
				recordings: arrayOfBBTs
			}

			allBBTDays.push(aDay);
		}//go through all days

		return allBBTDays;
	}
}

function createSignsArray(allSigns)
{
	var schemaSignsArray = [];

	var passedInSignsArray = allSigns;
	var numOfSigns = passedInSignsArray.length;

	console.log('there are ' + numOfSigns + ' number of signs');

	for( var i = 0; i < numOfSigns; i++ ) {

		var aSign = passedInSignsArray[i];

		console.log('sign name: ' + aSign.signName);
		console.log('date: ' + aSign.date);
		console.log('original_prob: ' + aSign.original_prob);
		console.log('calculated_prob: ' + aSign.calculated_prob);

		var schemaSign = {
			signName: aSign.signName,
		    date: aSign.date,
		    original_prob: aSign.original_prob,
		    calculated_prob: aSign.calculated_prob
		}

		schemaSignsArray.push(schemaSign);

	} //for

	return schemaSignsArray;
}

// http://localhost:8080/createUser

app.post('/createUser', function(req, res) {

	 console.log('POST parameter received, name is: ' + req.body.name);

     //req.body.flowDates is an array of strings coming in
     var flowDaysArray = createFlowDaysArray(req.body.flowDates);
     var bbtDaysArray = createBBTObject(req.body.bbtRecordings);


     var signsArray = createSignsArray(req.body.allSigns);

  // create a sample user
  var nick = new User({ 
  	email: req.body.email,
    name: req.body.name, 
    password: req.body.password, //You would protect your passwords by hashing it. 
    admin: true,
    
    status: req.body.status,
    ave_cycle_length: req.body.ave_cycle_length,
    birthday: req.body.birthday,
    age_first_period: req.body.age_first_period,
    physical_experiences: req.body.physical_experiences,
    how_long_trying_conceive: req.body.how_long_trying_conceive,
    is_this_first_baby: req.body.is_this_first_baby,
    physical_activity: req.body.physical_activity,
    bmi: req.body.bmi,

    allSigns: signsArray,
    flowDates: flowDaysArray,
    bbtRecordings: bbtDaysArray

  });



  // save the sample user
  nick.save(function(err) {
  	try {
    	if (err) throw err;
		console.log('User ' + req.body.email + ' saved successfully into database ' + config.database);
    	res.json({ success: true });
	}
	catch(err)
	{
		console.log('Error in adding user ' + req.body.email + ': ' + err);
		res.json({
			success:false,
			error: 'Error in adding user ' + req.body.email + ': ' + err
		});
	}

    
  });

});




module.exports = router