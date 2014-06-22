

var fs 		= require("fs");
var exec 	= require("child_process").exec;
var os 		= require("os");

var intervalTimerObj;


function startStream(sockets) {
	if(!intervalTimerObj) {
		intervalTimerObj = setInterval(function() { updateStream(sockets); }  , 3000);
	}
}
exports.startStream = startStream;


function stopStream() {	
	clearInterval(intervalTimerObj);
	intervalTimerObj = undefined;
}
exports.stopStream = stopStream;

function updateStream(sockets) {
	exec("ps au | tail -n+2", function(error, stdout, stderr) {
			if(error && error.code != 1) {
				throw error;
			}

			var nodeCpu = {cpu: 0, mem: 0};
			var otherCpu = {cpu: 0, mem: 0};
			var idleCpu = {cpu: 0, mem: 0};

			var lines = stdout.split("\n");
			lines.forEach(function(line) {
				var lineWords = line.match(/\S+/gi);

				if(lineWords && lineWords.length > 7){
					if(lineWords[10].indexOf("node") > -1|| lineWords[10].indexOf("raspistill") > -1) {
						nodeCpu["cpu"] = +nodeCpu["cpu"] + +lineWords[2] ;
						nodeCpu["mem"] = +nodeCpu["mem"] + +lineWords[3] ;
					} else {
						otherCpu["cpu"] = +otherCpu["cpu"] + +lineWords[2] ;
						otherCpu["mem"] = +otherCpu["mem"] + +lineWords[3] ;
					}
				}
			});

			idleCpu.cpu = 100 - nodeCpu.cpu - otherCpu.cpu;
			idleCpu.mem = 100 - nodeCpu.mem - otherCpu.mem;

			sockets.forEach(function(socket) {
				socket.emit("cpu", {node: nodeCpu, other: otherCpu, idle: idleCpu});
			});

		});
}
exports.updateStream = updateStream;