var express     = require('express');
if(express) {
  console.log("server.js - express loaded");
}

var app         = express();
if(app) {
  console.log("server.js - app loaded");
}
 
 var config 		= require('./config'); // get our config file
 if(config) {
   console.log("server.js - config loaded");
   console.log(config.secret + ", " + config.database);
 }

var bodyParser  = require('body-parser');
if(bodyParser) {
  console.log("server.js - body-parser loaded");
}
//var morgan      = require('morgan');
 
 //azure mobiel apps stuff
 var mobileApp = require('azure-mobile-apps')();

var http = require('http');
var port = process.env.PORT || 1337;


app.set('superSecret', config.secret); // secret variable
console.log("server.js - app sets config superSecret");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log("app uses bodyParser json");

app.use(require('./controllers'));

console.log("app requires ./controllers");

app.listen(port);
console.log('server.js - web services now exposed at http://localhost:' + port);
exports.app = app;
