

var fs 		= require("fs");
var spawn 	= require("child_process").spawn;
var os 		= require("os");
var logger	= require("./logger");

var intervalTimerObj;
var spawnTimer;

var delay = 3; 


function startStream(sockets) {
	if(!spawnTimer) {
		spawnTimer = spawn("top", ["-bid" + delay]);

		spawnTimer.stdout.on("data", function(cpulist) {
			cpulist = "" + cpulist;
			cpulist = cpulist.split("\n");
			cpulist.splice(0,9);

			var nodeCpu = {cpu: 0, mem: 0};
			var otherCpu = {cpu: 0, mem: 0};
			var idleCpu = {cpu: 0, mem: 0};

			cpulist.forEach(function(line) {
				var lineWords = line.match(/\S+/gi);

				if(lineWords && lineWords.length > 7){
					if(lineWords[11].indexOf("node") > -1|| lineWords[11].indexOf("raspistill") > -1) {
						nodeCpu["cpu"] = +nodeCpu["cpu"] + +lineWords[8] ;
						nodeCpu["mem"] = +nodeCpu["mem"] + +lineWords[9] ;
					} else {
						otherCpu["cpu"] = +otherCpu["cpu"] + +lineWords[8] ;
						otherCpu["mem"] = +otherCpu["mem"] + +lineWords[9] ;
					}
				}
			});

			idleCpu.cpu = 100 - nodeCpu.cpu - otherCpu.cpu;
			idleCpu.mem = 100 - nodeCpu.mem - otherCpu.mem;

			sockets.forEach(function(socket) {
				socket.emit("cpu", {node: nodeCpu, other: otherCpu, idle: idleCpu});
			});
		});


		spawnTimer.stderr.on("data", function(error) {
			logger.logSevere("Error in cpuInfoStreamer: " + error);
		});

		spawnTimer.on("close", function(data) {

		});
	}
}
exports.startStream = startStream;


function stopStream() {	
	spawnTimer.kill();
	spawnTimer = undefined;
}
exports.stopStream = stopStream;



