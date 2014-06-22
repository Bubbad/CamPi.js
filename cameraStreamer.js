

var fs 		= require("fs");
var raspcam = require("./raspcam.js");

var intervalTimerObj;


function startStream(sockets, options) {
	if(!intervalTimerObj) {
		setOptions(options);
		intervalTimerObj = setInterval(function() { updateStream(sockets); }  , 1000);
	}
}
exports.startStream = startStream;


function stopStream() {
	clearInterval(intervalTimerObj);
	intervalTimerObj = undefined;
}
exports.stopStream = stopStream;


function updateStream(sockets){
	raspcam.takePictureQuick();
	fs.readFile( __dirname + "/pic.jpg", function(err, image) {
		if(err) {
			logSevere("Error loading image.");
			throw err;
		}
		var base64img = new Buffer(image).toString("base64");

		sockets.forEach(function(socket) {
			socket.emit("image", base64img);
		});
	});	
}

function setOptions(options) {
	raspcam.setOptions(options);
}
exports.setOptions = setOptions;
