
/* MODULES */
var exec 	= require("child_process").exec;
var logger 	= require("./logger.js");

var options = "";

/* VARIABLES */

/* FUNCTIONS */
function takePictureQuick() {
	exec("raspistill --nopreview -w 640 -h 480 -q 10 -o " + __dirname + "/pic.jpg -t 100 -th 0:0:0", function(error, stdout, stderr) {
		if(error) {
			logger.logSevere("Error executing bash command");
			throw error;
		}
	});
}
exports.takePictureQuick = takePictureQuick;


function takePicture() {
	exec("raspistill --nopreview -o " + __dirname + "/pic.jpg -t 100 -th 0:0:0 " + options, function(error, stdout, stderr) {
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


function setOptions(options) {
	var optionsString = "";


	Object.keys(options).forEach(function(key) {
		switch(key) {
			case "night":
				if(key === true) {
					optionsString += "-ex night ";
				}
				break;
			case "width":
				optionsString += "-w " + key + " ";
				break;
			case "height":
				optionsString += "-h " + key + " ";
				break;
			case "quality":
				optionsString += "-q " + key + " ";
				break;
			default:
				break;
		}
	});

	options = optionsString;
}
exports.setOptions = setOptions;
