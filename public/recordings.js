window.onload = function() {

	socket = io.connect("http://eharr.servegame.com:3000");

    socket.emit("recordingsListRequest", "");

    socket.on("recordingsListResponse", function(data) {
    	data.forEach(function(record) {
    		var label = $("<label class='btn btn-danger'>" + record +"</label>");
            label.click(function() {
                label.removeClass("btn-danger");
                label.addClass("btn-success");
                socket.emit("recordingsRequest", record);
            });

            var li = $("<li></li>");
            li.append(label);
    		$("#recordingsList").append(li);
    	});
    });

    socket.on("image", function(data) {
        var base64Image = arrayBufferToBase64(data);
        $("#img").attr('src',"data:image/gif;base64," +  base64Image);
    });

    socket.on("recordingFinished", function(data) {
        $("label").removeClass("btn-success");
        $("label").addClass("btn-danger");
    });
}

function arrayBufferToBase64(imageBuffer) {
    var base64Binary = ''
    var bytes = new Uint8Array(imageBuffer);
    for (var i = 0; i < bytes.byteLength; i++) {
        base64Binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(base64Binary);
}