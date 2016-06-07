// =======================
// get the packages we need ============
// =======================
var express     = require('express');

var app         = express();

var bodyParser  = require('body-parser');

var morgan      = require('morgan');

var mongoose    = require('mongoose');

var config 		= require('./config'); // get our config file



// =======================
// configuration =========
// =======================
var port = 8080; // used to create, sign, and verify tokens

/*
mongoose.connect(config.database); // connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('mongoose db connected to ' + config.database);
});
*/

//app.set(name, value)
//Assigns setting name to application setting : value, 
//where name is one of the properties from the

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./controllers'));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.listen(port);
console.log('web services now exposed at http://localhost:' + port);


var strVar = "Ricky";
var strVar1 = "6680";
var strVar2 = "Ricky";
var strVar3 = "";

var intVar = 6680;

/*
console.log('------------------- STRING AND INT types ---------------------');
console.log('typeof ' + strVar + ' is ' + typeof(strVar));
console.log('typeof ' + strVar1 + ' is ' + typeof(strVar1));
console.log('typeof ' + strVar2 + ' is ' + typeof(strVar2));
console.log('typeof ' + strVar3 + ' is ' + typeof(strVar3));

console.log('typeof ' + intVar + ' is ' + typeof(intVar));

var mixedVar = strVar + intVar;
console.log('1) int + string is: ' + mixedVar + ', which is of type: ' + typeof(mixedVar));

//int + string = string
var mixedVar1 = intVar + strVar1;
console.log('2) int + string is: ' + mixedVar1 + ', which is of type: ' + typeof(mixedVar1));

//true + string = string
var bVar = true;
var mixedVar2 = bVar + strVar;
console.log('3) true + string is: ' + mixedVar2 + ', which is of type: ' + typeof(mixedVar2));

//true gets evaluated to int 1, hence result is 11
var mixedVar3 = bVar + 10;
console.log('4) true + int is: ' + mixedVar3 + ', which is of type: ' + typeof(mixedVar3));

//"Ricky" and "Ricky"
if(strVar === strVar2) {
	console.log( typeof(strVar) + ' ' + strVar + ', and ' 
		+ typeof(strVar2) + ' ' + strVar2 + ', are ===' );
}

//"Ricky" and "6680"
if(strVar !== strVar1) {
	console.log( typeof(strVar) + ' ' + strVar + ', and ' 
		+ typeof(strVar1) + ' ' + strVar1 + ', are !==' );
}

//"Ricky" and "Ricky"
if(intVar !== strVar1) {
	console.log( typeof(intVar) + ' ' + intVar + ', and ' 
		+ typeof(strVar1) + ' ' + strVar1 + ', are !==' );
}

//"Ricky" and "Ricky"
if(intVar == strVar1) {
	console.log( typeof(intVar) + ' ' + intVar + ', and ' 
		+ typeof(strVar1) + ' ' + strVar1 + ', are ==' );
}

var boolTrueVar = true;
var boolFalseVar = false;

console.log("-------------- TRUE/FALSE types -------------------");

console.log('typeof ' + boolTrueVar + ' is ' + typeof(boolTrueVar));
console.log('typeof ' + boolFalseVar + ' is ' + typeof(boolFalseVar));

if(boolTrueVar === boolTrueVar) {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof(boolTrueVar) + ' ' + boolTrueVar + ', are ===' );
}

if(boolTrueVar !== "true") {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof("true") + ' ' + "true" + ', are !==' );
}

if(boolTrueVar !== boolFalseVar) {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof(boolFalseVar) + ' ' + boolFalseVar + ', are !==' );
}

if(boolTrueVar == 1) {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof(1) + ' ' + 1 + ', are ==' );
}

if(boolTrueVar == "1") {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof("1") + ' ' + "1" + ', are ==' );
}



if(boolTrueVar != "hello") {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof("hello") + ' ' + "hello" + ', are !=' );
}

if(boolTrueVar != "true") {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof("true") + ' ' + "true" + ', are !=' );
}


if(boolTrueVar != 5) {
	console.log( typeof(boolTrueVar) + ' ' + boolTrueVar + ', and ' 
		+ typeof(5) + ' ' + 5 + ', are !=' );
}

if(boolFalseVar === boolFalseVar) {
	console.log( typeof(boolFalseVar) + ' ' + boolFalseVar + ', and ' 
		+ typeof(boolFalseVar) + ' ' + boolFalseVar + ', are ===' );
}

if(boolFalseVar == "0") {
	console.log( typeof(boolFalseVar) + ' ' + boolFalseVar + ', and ' 
		+ typeof("0") + ' ' + "0" + ', are ==' );
}

if(boolFalseVar != "false") {
	console.log( typeof(boolFalseVar) + ' ' + boolFalseVar + ', and ' 
		+ typeof("false") + ' ' + "false" + ', are !=' );
}

if(boolFalseVar !== "false") {
	console.log( typeof(boolFalseVar) + ' ' + boolFalseVar + ', and ' 
		+ typeof("false") + ' ' + "false" + ', are !==' );
}

if(boolFalseVar != "hehe") {
	console.log( typeof(boolFalseVar) + ' ' + boolFalseVar + ', and ' 
		+ typeof("hehe") + ' ' + "hehe" + ', are !=' );
}

if(boolFalseVar == 0) {
	console.log( typeof(boolFalseVar) + ' ' + boolFalseVar + ', and ' 
		+ typeof(0) + ' ' + 0 + ', are ==' );
}

console.log('-------------- NULL UNDEFINED TYPES ---------------');

var nullVar = null;
var unDefVar = undefined;

//null is object
console.log('typeof ' + nullVar + ' is ' + typeof(nullVar));
console.dir(nullVar);

//undefined is type undefined 
console.log('typeof ' + unDefVar + ' is ' + typeof(unDefVar));

console.log('null + null is: ' + (nullVar + nullVar) + ', which is of type: ' + typeof(nullVar + nullVar));
console.log('null + 1 is: ' + (nullVar + 1) + ', which is of type: ' + typeof(nullVar + 1));
console.log('null + abc is: ' + (nullVar + 'abc') + ', which is of type: ' + typeof(nullVar + 'abc'));
*/
exports.app = app;
