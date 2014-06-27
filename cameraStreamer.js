
var memwatch= require('memwatch');
var fs 		= require("fs");
var raspcam = require("./raspcam.js");
var logger 	= require("./logger.js");

var intervalTimerObj;
var running = false;

var recording = false;
var recordingsDir;
var recordingIndex;


function startStream(sockets) {
	if(!intervalTimerObj) {
		raspcam.takePicture();
		running = true;
	}
	
	clearTimeout(intervalTimerObj);
	intervalTimerObj = setTimeout(updateStream, 1000, sockets);
	
}
exports.startStream = startStream;


function stopStream() {
	clearTimeout(intervalTimerObj);
	intervalTimerObj = undefined;
	raspcam.stopAll();
	running = false;
	stopRecording();
}
exports.stopStream = stopStream;


function updateStream(sockets){
	fs.readFile( __dirname + "/pic.jpg", function(err, image) {
		if(err) {
			logger.logSevere("Error loading image.");
		}

		sockets.forEach(function(socket) {
			socket.emit("image", image);
		});

		if(recording === true) {
			fs.writeFile(recordingsDir + "/pic" + padZeros(recordingIndex, 5) + ".jpg", image, function(error) {
				if(error) {
					logger.logSevere("updateStream: " + error);
				}

				recordingIndex++;
				image = null;
			});
		}

		startStream(sockets);
	});
}

function setOptionsString(options) {
	raspcam.setOptionsString(options);
	if(options["running"] === true) {
		raspcam.restart();		
	} 
}
exports.setOptionsString = setOptionsString;


function startRecording() {
	var date = new Date();
	var dirName = __dirname + "/recordings/" 
							+ date.getUTCFullYear() + "-" 
							+ padZeros(date.getUTCMonth(), 2) + "-" 
							+ padZeros(date.getUTCDay(),2 ) + "_" 
							+ padZeros(date.getUTCHours(), 2) + ":" 
							+ padZeros(date.getUTCMinutes(), 2) + ":"
							+ padZeros(date.getUTCSeconds(), 2);

	fs.exists(__dirname + "/recordings", function(exists) {
		if(!exists) {
			fs.mkdir(__dirname + "/recordings");
		}
		fs.mkdir(dirName);

		recording = true;
		recordingsDir = dirName;
		recordingIndex = 0;
	});
}
exports.startRecording = startRecording;


function stopRecording() {
	recording = false;
	recordingsDir = undefined;
}
exports.stopRecording = stopRecording;


function padZeros(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

