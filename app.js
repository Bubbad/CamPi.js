
/* MODULES */
var express = require('express');
var http 	= require('http');
var path 	= require('path');
var app 	= express();

var logger = require("./logger.js");
var streamer = require("./streamer.js");
var routes	= require('./routes');

/* VARIABLES */
var clients = [];
var port = 3000;


app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 			
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	logger.logInfo('Express server listening on port ' + app.get('port'));
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
	logger.logInfo("User connected");
	clients.push(socket);

	socket.emit("connected", {message: "hello"});
	streamer.startImageStream(clients);

	socket.on("disconnect", function() {
		logger.logInfo("User disconnected");

		//Removes user
		var i = clients.indexOf(socket);
		clients.splice(i,i+1);


		if(clients.length == 0) {
			logger.logInfo("All users disconnected, stopping camera");
			streamer.stopImageStream();
		}
	})
});




