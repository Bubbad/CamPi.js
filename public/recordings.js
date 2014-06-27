window.onload = function() {

	socket = io.connect("http://eharr.servegame.com:3000");

    socket.emit("recordingsListRequest", "");

    socket.on("recordingsListResponse", function(data) {
    	console.log("here");
    	data.forEach(function(record) {

    		/*var label = $(document.createElement('label'));
    		label.addClass("btn btn-danger");
    		label.text(record);

    		var li = $(document.createElement("li")).append(label);
    		$("#recordingsList").append(li);*/

    		var label = $("<li><label class='btn btn-danger'>" + record +"</label></li>");
    		$("#recordingsList").append("<li><label class='btn btn-danger'>" + record +"</label></li>");
    	});
    });

}