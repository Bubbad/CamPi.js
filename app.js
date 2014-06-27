
/* MODULES */
var express = require('express');
var http 	= require('http');
var path 	= require('path');
var app 	= express();

var logger 		= require("./logger.js");
var streamer 	= require("./cameraStreamer.js");
var cpuinfo 	= require("./cpuInfoStreamer.js");
var routesIndex	= require('./routes');
var routesRec	= require('./routes/recordings.js');
var routesAbout	= require('./routes/about.js');

/* VARIABLES */
var clients = [];
var port = 3000;
var options = {running: true, recording: false, night: false, width: 640, height: 480, quality: 10};
var optionsFunctions = [];

app.use(express.favicon(__dirname + '/public/images/rasbpi.ico'));
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 			
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", routesIndex.index);
app.get("/recordings", routesRec.index);
app.get("/about", routesAbout.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	logger.logInfo('Express server listening on port ' + app.get('port'));
	logger.setDebug(true);
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
	var clientAddress = socket.request.connection.remoteAddress;
	logger.logInfo("User subscribed to camera feed: " + clientAddress);
	clients.push(socket);

	clientAddress = null;

	streamer.startStream(clients, options);
	cpuinfo.startStream(clients);

	socket.emit("options", options);

	socket.on("disconnect", function() {
		logger.logInfo("User disconnected");

		//Removes user
		var i = clients.indexOf(socket);
		clients.splice(i,i+1);

		if(clients.length == 0) {
			logger.logInfo("All users disconnected, stopping camera");
			streamer.stopStream();
			cpuinfo.stopStream();
		}
	});

	socket.on("option", function(data) {
		Object.keys(data).forEach(function(key) {
			options[key] = data[key];
		});
		
		optionsFunctions["running"](data);
		optionsFunctions["recording"](data);

		streamer.setOptionsString(options);
		clients.forEach(function(socket) {
			socket.emit("options", options);
		});

	});
});

optionsFunctions["running"] = function(data) {
	if(data["running"] != undefined) {
		if(data.running == false) {
			logger.logInfo("Stopping camera");
			streamer.stopStream();
		} else {
			logger.logInfo("Starting camera");
			streamer.startStream(clients, options);
		}
	}
}

optionsFunctions["recording"] = function(data) {
	if(data["recording"] != undefined) {
		if(data.recording == true) {
			logger.logInfo("Starting recording");
			streamer.startRecording();
		} else {
			logger.logInfo("Stopping recording");
			streamer.stopRecording();
		}		
	}
}

optionsFunctions["options"] = streamer.setOptionsString;