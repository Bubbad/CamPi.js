
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


var app = express();

var raspcam = require("./raspcam.js");
var logger = require("./logger.js");
var streamer = require("./streamer.js");


var intervalTimerObj;
var clients = [];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views'); //sets views location
app.set('view engine', 'ejs'); 			//sets engine to ejs
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));	//sets static files location

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server = http.createServer(app).listen(app.get('port'), function(){
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

		var i = clients.indexOf(socket);
		clients.splice(i,i+1);


		if(clients.length == 0) {
			logger.logInfo("All users disconnected, stopping camera");
			streamer.stopImageStream();
		}
	})
});




