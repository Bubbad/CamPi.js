
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