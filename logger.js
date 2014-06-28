
var fs = require("fs");
var os = require('os');

/* VARIABLES */
var debug = false;
var logFile = "access.log";

/* FUNCTIONS */
function logInfo(message) {
	var infoMessage = getDateString() + "[INFO] " + message;
	console.log(infoMessage);
	logToFile(infoMessage);
}
exports.logInfo = logInfo;

function logSevere(message) {
	var severeMessage = getDateString() + "[SEVERE] " +  message;
	console.log(severeMessage);
	console.trace();
	logToFile(severeMessage);
	logToFile(console.trace());
}
exports.logSevere = logSevere;

function logDebug(message) {
	if(debug === true) {
		var debugMessage = getDateString() + "[DEBUG] " + message;
		console.log(debugMessage);	
		logToFile(debugMessage);	
	}
}
exports.logDebug = logDebug;

function logRequest(request) {
	var clientIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	logInfo(clientIp + " requested '" + request.originalUrl + "' User-agent: " + request.headers["user-agent"]);	
}
exports.logRequest = logRequest;

function setDebug(active) {
	debug = active;
}
exports.setDebug = setDebug;

function logToFile(message) {
	fs.appendFile(__dirname + "/" + logFile, message + "\r\n", function(error) {
		if(error) {
			throw error;
			logger.logSevere("logToFile: " + error);
		}
	});
}

function getDateString() {
	var date = new Date();
	return			  	date.getUTCFullYear() 				+ "-" 
						+ padZeros(date.getUTCMonth(), 	2) 	+ "-" 
						+ padZeros(date.getUTCDay(), 	2) 	+ "_" 
						+ padZeros(date.getUTCHours(), 	2) 	+ ":" 
						+ padZeros(date.getUTCMinutes(),2) 	+ ":"
						+ padZeros(date.getUTCSeconds(),2)	+ " ";
}

function padZeros(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
