
window.onload = function() {

	var socket = io.connect("http://eharr.servegame.com:3000");

	socket.on("connected", function(data) {
		if(data.message) {
			$("#msg").text(data.message);
		}
	});

	socket.on("image", function(data) {
		
		$("#img").attr("src", "data:image/gif;base64," + data);
		
	});
}


	google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['CamPi.js',     11],
          ['Idle',      87],
          ['Other',      2]
        ]);

        var options = {
          title: 'My Daily Activities',
          chartArea:{left:20,top:51},
          colors:["red","blue","yellow"]
        };

        var chart = new google.visualization.PieChart(document.getElementById('CPUChart'));
        chart.draw(data, options);

        var chart2 = new google.visualization.PieChart(document.getElementById('CPUChart2'));
        chart2.draw(data, options);
      }
  