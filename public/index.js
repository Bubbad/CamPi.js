
var socket;

window.onload = function() {

	socket = io.connect("http://eharr.servegame.com:3000");

	socket.on("image", function(data) {
        $("#img").attr("src", "data:image/gif;base64," + data);
	});

    socket.on("cpu", function(data) {
        drawChart(data);
    });

    socket.on("options", function(data) {
        Object.keys(data).forEach(function(key) {
            var label = $("#" + key + "Btn");
            if(data[key] === true) {
                label.removeClass("btn-danger");
                label.addClass("btn-success");
            } else {
                label.addClass("btn-danger");
                label.removeClass("btn-success");
            }
        });

        console.log(data);
    });
}


google.load("visualization", "1", {packages:["corechart"]});

function drawChart(cpuData) {
    var data = google.visualization.arrayToDataTable([
      ['Task', 'CPU Usage'],
      ['CamPi.js',  cpuData.node.cpu],
      ['Idle',      cpuData.idle.cpu],
      ['Other',     cpuData.other.cpu]
    ]);

    var options = {
      title: 'CPU usage',
      chartArea:{left:0,top:61},
      colors:["red","blue","yellow"]
    };

    var chart = new google.visualization.PieChart(document.getElementById('CPUChart'));
    chart.draw(data, options);
}

$(document).ready(function() {
    $("#stopBtn").click( function() {
        socket.emit("option", {running: true});
    });

    $("#recordBtn").click( function() {
        socket.emit("option", {recording: true});
    });

    $("#nBtn").click( function() {
        socket.emit("option", {night: true});
    });
});
  