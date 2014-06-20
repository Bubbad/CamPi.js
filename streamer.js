

var fs 		= require("fs");
var raspcam = require("./raspcam.js");

var intervalTimerObj;


function startImageStream(sockets) {
	if(!intervalTimerObj) {
			intervalTimerObj = setInterval(updateStream , 1000);
		}
}
exports.startImageStream = startImageStream;


function stopImageStream() {
	clearInterval(intervalTimerObj);
	intervalTimerObj = undefined;
}
exports.stopImageStream = stopImageStream;


function updateStream(){
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
