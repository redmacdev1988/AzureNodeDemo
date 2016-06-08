/*var http = require('http');

var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);
*/


var express     = require('express');
 
var app         = express();
 
var bodyParser  = require('body-parser');
 
var morgan      = require('morgan');
 
var mongoose    = require('mongoose');
 
var config 		= require('./config'); // get our config file


var port = 8080; // used to create, sign, and verify tokens
 
app.set('superSecret', config.secret); // secret variable
 
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./controllers'));
 
// use morgan to log requests to the console
app.use(morgan('dev'));
 
app.listen(port);
console.log('web services now exposed at http://localhost:' + port);
 
 exports.app = app;