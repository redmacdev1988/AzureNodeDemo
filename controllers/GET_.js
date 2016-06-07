

module.exports = function(router){

	// route to show a random message (GET http://localhost:8080/)
	router.get('/', function(req, res) {

	  	res.json({ message: 'Yono web service API. Copyright Yonolabs 2015' });
	});

}