
/* MODULES */
var express = require('express');
var http 	= require('http');
var path 	= require('path');
var app 	= express();

var logger = require("./logger.js");
var streamer = require("./cameraStreamer.js");
var cpuinfo = require("./cpuInfoStreamer.js");
var routes	= require('./routes');

/* VARIABLES */
var clients = [];
var port = 3000;
var options = {running: true, recording: false, night: false, width: 640, height: 480, quality: 10};
var optionsFunctions = [];


app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 			
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	logger.logInfo('Express server listening on port ' + app.get('port'));
	logger.setDebug(true);
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
	logger.logInfo("User connected");
	clients.push(socket);

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

		optionsFunctions["running"]();
		streamer.setOptionsString(options);
		clients.forEach(function(socket) {
			socket.emit("options", options);
		});
	});
});

optionsFunctions["running"] = function() {
	if(options.running == false) {
		streamer.stopStream();
	} else {
		streamer.startStream(clients, options);
	}
}

optionsFunctions["options"] = streamer.setOptionsString;