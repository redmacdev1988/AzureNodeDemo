/*var http = require('http');

var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);
*/


var express     = require('express');
if(express) {
  console.log("express loaded");
}

var app         = express();
if(app) {
  console.log("app loaded");
}
 
 var config 		= require('./config'); // get our config file
 if(config) {
   console.log("config loaded");
   console.log(config.secret + ", " + config.database);
 }

var bodyParser  = require('body-parser');
if(bodyParser) {
  console.log("body-parser loaded");
}
//var morgan      = require('morgan');
 
var http = require('http');

var port = process.env.PORT || 1337;

/*
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);
*/


app.set('superSecret', config.secret); // secret variable
console.log("app sets config superSecret");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log("app uses bodyParser json");

app.use(require('./controllers'));

console.log("app requires ./controllers");

app.listen(port);
console.log('server.js - web services now exposed at http://localhost:' + port);
exports.app = app;

/*
 
// use morgan to log requests to the console
app.use(morgan('dev'));
 
app.listen(port);
console.log('web services now exposed at http://localhost:' + port);
 
 exports.app = app;
 */