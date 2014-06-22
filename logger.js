
/* VARIABLES */
var debug = false;

/* FUNCTIONS */
function logInfo(message) {
	var infoMessage = "[INFO] " + message;
	console.log(infoMessage);
}
exports.logInfo = logInfo;

function logSevere(message) {
	var severeMessage = "[SEVERE] " + message;
	console.log(severeMessage);
}
exports.logSevere = logSevere;

function logDebug(message) {
	if(debug === true) {
		var debugMessage = "[DEBUG] " + message;
		console.log(debugMessage);		
	}
}
exports.logDebug = logDebug;

function setDebug(active) {
	debug = active;
}
exports.setDebug = setDebug;