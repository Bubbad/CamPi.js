

var fs 		= require("fs");
var raspcam = require("./raspcam.js");

var intervalTimerObj;
var running = false;


function startStream(sockets, options) {
	if(!intervalTimerObj) {
		raspcam.takePicture();
		running = true;
		intervalTimerObj = setInterval(function() { updateStream(sockets); }  , 1000);
	}
}
exports.startStream = startStream;


function stopStream() {
	clearInterval(intervalTimerObj);
	intervalTimerObj = undefined;
	raspcam.stopAll();
	running = false;
}
exports.stopStream = stopStream;


function updateStream(sockets){

	fs.readFile( __dirname + "/pic.jpg", function(err, image) {
		if(err) {
			logSevere("Error loading image.");
		}
		var base64img = new Buffer(image).toString("base64");

		sockets.forEach(function(socket) {
			socket.emit("image", base64img);
		});
	});	
}

function setOptionsString(options) {
	raspcam.setOptionsString(options);
	if(running === true) {
		raspcam.restart();		
	}
}
exports.setOptionsString = setOptionsString;
