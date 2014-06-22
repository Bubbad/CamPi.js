
/* MODULES */
var exec 	= require("child_process").exec;
var logger 	= require("./logger.js");

/* VARIABLES */

/* FUNCTIONS */
function takePictureQuick() {
	exec("raspistill --nopreview -w 640 -h 480 -q 10 -o " + __dirname + "/pic.jpg -t 100 -th 0:0:0 &", function(error, stdout, stderr) {
		if(error) {
			logger.logSevere("Error executing bash command");
			throw error;
		}
	});
}
exports.takePictureQuick = takePictureQuick;


function takePicture(options) {
	exec("raspistill " + options, function(error, stdout, stderr) {
		if(error) {
			logger.logSevere("Error executing bash command");
			throw error;
		}
	});
}
exports.takePicture = takePicture;


function stopAll() {
	exec("pkill -f raspi", function(error, stdout, stderr) {
		if(error) {
			logger.logSevere("Error executing bash command");
			throw error;
		}
	});
}
exports.stopAll = stopAll;