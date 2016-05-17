console.log(' --- client.js start --- ');

window.gPort = "8881";
//80 for live

//must match the url string of your domain name. The name that you use
//to access the webpage.
//http://ecsa00100ae2.epam.com
window.gURL = "http://localhost:" + window.gPort;

/////////// init device id ///////////////////////////////


function KelvinToCelsius (kelvin) {
	return Math.round(kelvin - 273.15);
}


var badmintonWindowOpened 	= false;
var temperatureWindowOpened = false;

$(function() {

	console.log("client.js - --------> running init for app");

	$("#note").html("<p></p>").css({'height':0, 'opacity':0});
	$("#quoteDiv").css("opacity","0");

	//GET QUOTE ON REFRESH: check the database for an inspirational quote
	$.ajax({
		type: 	'GET',
		url: 	window.gURL + "/getquote",
		data:{},
		success: function(quote) {
			console.log("quote is: " + quote);
			$("#quoteDiv").css("opacity","0");
			$("#quoteDiv").text(quote).show("slow").animate({"opacity":1});
		}
	});

	//GET NEXT EVENT: checks the database for datetime info.
	$.ajax({
		type: 	'POST',
		url: 	window.gURL + "/init",
		data:{},
		success: function(fromServer) {

			if(fromServer.message === "REGISTRATION_CLOSED") {
				console.log("REGISTRATION IS NOW CLOSED...LETS empty registration and directions");
				//let's empty registration

				$('#registrations-container').children().fadeOut(800, function() {
				    $('#registrations-container').empty();
				});

				$('.container').children().fadeOut(800, function() {
				    $('.container').empty();
				});

				$('#RegistrationClosedModal').modal('show');
			}

			else if (fromServer.message === "NO_EVENTS") {

				console.log("NO EVENTS!!!!");

				$("#event-date").text("");
				$("#event-description").text("No event scheduled");
				$("#badminton-outer").css("opacity","0");
			}
			else {
				console.log("client.js - next event is: " + fromServer.data);

				console.log("date: " +fromServer.data.date);
				console.log("description: " + fromServer.data.description);

				var cleanDate = fromServer.data.date.substr(0, fromServer.data.date.indexOf('T')); 

				$("#badminton-outer").css("opacity","1");
				$("#event-date").text(cleanDate);
				$("#event-description").text(fromServer.data.description);
			}
		}
	}); //ajax
	
	console.log('client.js - entered main function!');


	//for when we click inside of a textfield
	$('.form-control').click(function() {
		$("#attendee-email").css({"background-color":"white"});
	});

	//only allow alphabets and spaces for emails
	$("#attendee-email").keydown(function(event){

		//allows ., backspace, and underline
		if ( 	(event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 189)  
			|| 	(event.keyCode >= 65 && event.keyCode <= 90) //A-Z
			|| 	(event.keyCode >= 97 && event.keyCode <= 122  )  //a-z
			)
		{
    		// let the numerics appear
    	}
    	else {
    		event.preventDefault();		
    	}
	});

	//$('#register-user').on('shown.bs.modal', function () {
	$('#register-attendee').click(function() {
 
 		console.log("client.js - .on arrived");
 		var everythingOK = false;

		$("#note").clearQueue();
		$("#note").stop();

		console.log("client.js - register attendee button pressed!");

		var attendeeEmail 		= $('#attendee-email').val();

		if(!attendeeEmail) {

			console.log("client.j - empty textfield detected");
			$("#attendee-email").css({"background-color":"#fff0f7"});

			$("#note")
			.html("<p>Please fill out all empty textfields</p>")
			.animate({ height: 90, opacity: 1}, 'slow');

			
			$('#note').delay(2000).animate({ height: 0, opacity: 0 }, 'slow');
			console.log("client.js - exiting....textfields empty");
			
			return;
		}

		console.log("textfield data OK!.... " + attendeeEmail);
		console.log("executing AJAX POST /registerAttendee");

		$('#register-user').modal({backdrop: 'static', keyboard: false});
		$('#register-user').modal('show');

		$.ajax({
	        type: 	'POST',
	        url: 	window.gURL + "/registerAttendee",

			data:
				{
				    "email"				: attendeeEmail
				},
			success: function(msg) {

				//console.dir(msg);
				if(msg.error) {

					console.log("client.js - uh oh error: " + msg.error);

					$("#note")
					.html("<p>Uh oh, there was an error:" + msg.error + ", please contact the admin")
					.animate({ height: 90, opacity: 1}, 'slow');
					$('#note').delay(5000).animate({ height: 0, opacity: 0}, 'slow');
					return;

				} else if(msg === "NO_EVENTS") {

					console.log("client.js - NO_EVENTS");
					setTimeout( function() {

						$('#register-user').modal('hide');
						console.log("client.js - NO EVENT FOUND");

						$("#note")
						.html("<p>No Event Found. Please come back later")
						.animate({ height: 90, opacity: 1}, 'slow');


						$('#note').delay(5000).animate({ height: 0, opacity: 0}, 'slow');

					}, 3000);	

				} else if(msg === "EMAIL_EXISTS") {

					setTimeout( function() {

						$('#register-user').modal('hide');
						console.log("client.js - EMAIL or EMPLOYEE ID ALREADY EXISTS");

						$("#note")
						.html("<p>Email or Employee ID already exists. Please retry")
						.animate({ height: 90, opacity: 1}, 'slow');

						$('#note').delay(5000).animate({ height: 0, opacity: 0}, 'slow');
					}, 3000);	

				} else {

					$('#register-user').modal('hide');

					console.log('client.js -  register-attendee returned: ' + msg.message);
					
					$("#note")
					.html("<p>Thank for your interest! Please check your email to Register for this event</p>")
					.animate({ height: 90, opacity: 1}, 'slow');
					$('#note').delay(5000).animate({ height: 0, opacity: 0}, 'slow');
				} 
				

	    	} //success
	    }); //ajax
	});


	$('#send-results').click(function() {

		console.log("send results button pressed!");
		
	    $.ajax({
	        type: 	'GET',
	        url: 	window.gURL + "/email_to_admin",

			success: function(msg) {
				console.log('client.js -  register-attendee returned: ' + msg.message);
	    	}
	    }); //ajax
		
	}); //click function


	
//////////////////////// TEMPERATURE HANDLERS /////////////////////////

	$('#temperature').hover(function(event) {
	      event.preventDefault(); // because it is an anchor element
	      console.log("hovered in temperature");
	      temperatureWindowOpened = true;
	      $(this).stop().animate({
	          right: '-20px'
	      }, 280, "linear", function(){
	      	//complete
	      });

	}, function(event){
			
			event.preventDefault(); // because it is an anchor element
	      console.log("hovered out temperature");
	      temperatureWindowOpened = false;
	       $(this).stop().animate({
	          right: '-180px'
	      }, 280, "linear", function(){
	      	//complete
	      });

	});
//////////////////////////////////////////////////////////////////


/////////////// BADMINTON ICON EVENT HANDLER  ///////////////////


	$('#badminton-icon').hover(function(event) {
	      event.preventDefault(); // because it is an anchor element
	      console.log("hovered in");
	      $('#badminton-icon').stop().animate({
	          left: '-100px'
	      });

	      badmintonWindowOpened = true;

	}, function(event){
		  event.preventDefault(); // because it is an anchor element
	      console.log("hovered out");
	      $('#badminton-icon').stop().animate({
	          left: '-400px'
	      });

	      badmintonWindowOpened = false;
	});

}); //function

///////////////////////////////////////////////////////////

console.log(' --- client.js end --- ');
