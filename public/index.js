
window.onload = function() {

	var socket = io.connect("http://eharr.servegame.com:3000");

	socket.on("image", function(data) {
        $("#img").attr("src", "data:image/gif;base64," + data);
	});

    socket.on("cpu", function(data) {
        drawChart(data);
    });
}


google.load("visualization", "1", {packages:["corechart"]});
//google.setOnLoadCallback(drawChart);

function drawChart(cpuData) {
    var data = google.visualization.arrayToDataTable([
      ['Task', 'CPU Usage'],
      ['CamPi.js',  cpuData.node.cpu],
      ['Idle',      cpuData.idle.cpu],
      ['Other',     cpuData.other.cpu]
    ]);

    var options = {
      title: 'CPU usage',
      chartArea:{left:0,top:51},
      colors:["red","blue","yellow"]
    };

    var chart = new google.visualization.PieChart(document.getElementById('CPUChart'));
    chart.draw(data, options);
}
  