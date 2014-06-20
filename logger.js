
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
