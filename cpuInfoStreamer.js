

var fs 		= require("fs");
var spawn 	= require("child_process").spawn;
var os 		= require("os");

var intervalTimerObj;
var spawnTimer;


function startStream(sockets) {
	if(!intervalTimerObj) {
		intervalTimerObj = setInterval(function() { updateStream(sockets); }  , 3000);
		spawnTimer = spawn("top", ["-bid3"]);

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


		spawnTimer.stderr.on("data", function(data) {
			console.log("error: " + data);
		});

		spawnTimer.on("close", function(data) {
			console.log(data);
});
	}
}
exports.startStream = startStream;


function stopStream() {	
	clearInterval(intervalTimerObj);
	intervalTimerObj = undefined;
}
exports.stopStream = stopStream;

function updateStream(sockets) {
	/*exec("top -bn1i | tail -n+8", function(error, stdout, stderr) {
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

		});*/
}
exports.updateStream = updateStream;




