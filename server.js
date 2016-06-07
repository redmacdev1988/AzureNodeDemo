// =======================
// get the packages we need ============
// =======================
var express     = require('express');

var app         = express();

var bodyParser  = require('body-parser');

var morgan      = require('morgan');

var mongoose    = require('mongoose');

var config 		= require('./config'); // get our config file

var port = 8080; // used to create, sign, and verify tokens


//npm i sqlite3
//npm install --save azure-mobile-apps
var mobileApp = require('azure-mobile-apps')(); // Create an instance of a Mobile App with default settings

/*
if(auth.validate(req.get('x-zumo-auth')))
    res.status(200).send("Successfully authenticated");
else
    res.status(401).send("You must be logged in");
*/

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./controllers'));

// use morgan to log requests to the console
app.use(morgan('dev'));

//GET
app.get('/profile',(req,res)=>{
 
    console.log("--- server.js - /profile GET ---");

    res.json({
     "url":"/profile",
     "fileName":"server.js"    
    });
});

app.listen(port);
console.log('web services now exposed at http://localhost:' + port);


var strVar = "Ricky";
var strVar1 = "6680";
var strVar2 = "Ricky";
var strVar3 = "";

var intVar = 6680;

//jdbc:sqlserver://azurenodedemo.database.windows.net:1433;database=azurenodedemo;user=rtsao@azurenodedemo;password={your_password_here};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;


var tedConfig = {
    userName: 'rtsao@azurenodedemo',
    password: 'Tsao6680',
    server:   'azurenodedemo.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'azurenodedemo'}
};

var Connection = require('tedious').Connection;

//create new connection
var connection = new Connection(tedConfig);
connection.on('connect', function(err) {

    if (err) return console.error(err);

    console.log("Connected!!");
    executeStatement();


});


var Request = require('tedious').Request;
var TYPES   = require('tedious').TYPES;

function executeStatement() {
	
    var createStmt = "CREATE TABLE Persons ( PersonID int, LastName varchar(255), FirstName varchar(255), Address varchar(255), City varchar(255) );";
    var getAllTableNames = "SELECT name FROM sys.tables";
    var showColumnNames = "select name from syscolumns where id=object_id('Persons')";

    request = new Request(showColumnNames, function(err) {
    if (err) {
        console.log(err);}
    });

    var result = "";

    //Node.js is evented, thus listening for events

    // listen for 'row' event
    request.on('row', function(columns) {

        columns.forEach(function(column) {

          //console.dir(column);

          if (column.value === null) {
            console.log('server.js - column value is NULL');
          } else {
            result += column.value + ", ";
          }

        });

        console.log(result);
        result ="\n\n";
    });

    // listen for 'done' event
    request.on('done', function(rowCount, more) {
      console.log("server.js - ALL DONE");
      console.log(rowCount + ' rows returned');
    });

    console.log("server.js - EXECUTE SQL");
    connection.execSql(request);
}

exports.app = app;
