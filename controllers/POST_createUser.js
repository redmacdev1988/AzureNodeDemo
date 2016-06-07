
var config = require('../config'); 				// get our config file

var User   = require('../models/user'); // get our mongoose model


//utility functions
function createFlowDaysArray(datesArray)
{
	var flowDaysArray = [];
	if(datesArray !== undefined) {

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
			console.log('POST_createUser.js (createBBTObject) - processing recordings for date is: ' + date);

			var recordings = arrayOfDays[i].recordings;
			var numOfRecordings = recordings.length;
			console.log('POST_createUser.js (createBBTObject) - there are ' + numOfRecordings + ' recordings for ' + date);

			var arrayOfBBTs = []; //an array of BBTs for this day

			//for this particular day, let's collect array of time and temps
			for ( var j = 0; j < numOfRecordings; j++) {

				var aRecord = recordings[j];

				console.log(j + ':--> time: '  + aRecord.time + ',\t temperature: '  + aRecord.temperature);


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

	return allBBTDays;
}

function createSignsArray(allSigns)
{
	var schemaSignsArray = [];
	if(allSigns !== undefined && allSigns.length > 0) {
		
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

	return schemaSignsArray;

}

////////


module.exports = function(router){

	
	//POST http://localhost:8080/createUser
	//BODY, all user info
	router.post('/createUser', function(req, res) {

		 console.log('POST_createUser.js - name is: ' + req.body.name);
		 console.dir('POST_createUser.js - req.body.bbtRecordings: ' + req.body.bbtRecordings);

	     console.log('POST_createUser.js - number of signs: ' + req.body.allSigns.length);

	     var flowDaysArray = 		createFlowDaysArray(req.body.flowDates);
	     var bbtDaysArray = 		createBBTObject(req.body.bbtRecordings);
	     var signsArray = 			createSignsArray(req.body.allSigns);

	  // create a sample user
	  var nick = new User({ 
	  	email: 						req.body.email,
	    name: 						req.body.name, 
	    password: 					req.body.password, //You would protect your passwords by hashing it. 
	    admin: 						true,
	    
	    status: 					req.body.status,
	    ave_cycle_length: 			req.body.ave_cycle_length,
	    birthday: 					req.body.birthday,
	    age_first_period: 			req.body.age_first_period,
	    physical_experiences: 		req.body.physical_experiences,
	    how_long_trying_conceive: 	req.body.how_long_trying_conceive,
	    is_this_first_baby: 		req.body.is_this_first_baby,
	    physical_activity: 			req.body.physical_activity,
	    bmi: 						req.body.bmi,

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

}