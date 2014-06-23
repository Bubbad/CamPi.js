
/* MODULES */
var exec 	= require("child_process").exec;
var logger 	= require("./logger.js");

var options = "-w 640 -h 480 -q 10";

/* VARIABLES */

/* FUNCTIONS */
function takePictureQuick() {
	exec("raspistill --nopreview -w 640 -h 480 -q 10 -o " + __dirname + "/pic.jpg -t 9999999 -tl 1000 -th 0:0:0", function(error, stdout, stderr) {
		logger.logInfo("Stopped camera");
	});
}
exports.takePictureQuick = takePictureQuick;


function takePicture() {
	exec("raspistill --nopreview " + options +" -o " + __dirname + "/pic.jpg -t 9999999 -tl 1000 -th 0:0:0", function(error, stdout, stderr) {
		logger.logInfo("Stopped camera");
	});
}
exports.takePicture = takePicture;


function stopAll() {
	exec("pkill -f raspi", function(error, stdout, stderr) {
		if(!error) {
			logger.logInfo("Stopped camera");
		}
	});
}
exports.stopAll = stopAll;


function setOptionsString(newOptions) {
	var optionsString = "";


	Object.keys(newOptions).forEach(function(key) {
		switch(key) {
			case "night":
				if(key === true) {
					optionsString += "-ex night ";
				}
				break;
			case "width":
				optionsString += "-w " + newOptions[key] + " ";
				break;
			case "height":
				optionsString += "-h " + newOptions[key] + " ";
				break;
			case "quality":
				optionsString += "-q " + newOptions[key] + " ";
				break;
			default:
				break;
		}
	});

	options = optionsString;
}
exports.setOptionsString = setOptionsString;

function restart() {
	stopAll();
	takePicture();
}
exports.restart = restart;