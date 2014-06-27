
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
	console.trace();
}
exports.logSevere = logSevere;

function logDebug(message) {
	if(debug === true) {
		var debugMessage = "[DEBUG] " + message;
		console.log(debugMessage);		
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