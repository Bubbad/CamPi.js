
var socket;

window.onload = function() {

	socket = io.connect("http://eharr.servegame.com:3000");

	socket.on("image", function(data) {
        var base64Image = arrayBufferToBase64(data);
        $("#img").attr('src',"data:image/gif;base64," +  base64Image);
    });

    socket.on("cpu", function(data) {
        drawChart(data);
    });

    socket.on("options", function(data) {
        updateOptionButtonClass("runningBtn", data.running);
        updateOptionButtonClass("recordingBtn", data.recording);
        updateOptionButtonClass("nightBtn", data.night);
        $("#qualitySliderValue").text(data.quality);
        $("#widthSliderValue").text(data.width);
        $("#heightSliderValue").text(data.height);

        console.log(data);
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

function updateOptionButtonClass(btnId, boolean) {
    var label = $("#" + btnId);
    if(boolean === true) {
        label.removeClass("btn-danger");
        label.addClass("btn-success");
        console.log("here");
    } else {
        label.addClass("btn-danger");
        label.removeClass("btn-success");
    }
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
      backgroundColor:"#f5f5f5",
      width:300,
      height:300,
      chartArea:{left:0,top:61, height:"100%", width:"100%"},
      colors:["red","blue","yellow"]
    };

    var chart = new google.visualization.PieChart(document.getElementById('CPUChart'));
    chart.draw(data, options);
}

$(document).ready(function() {
    $("#runningBtn").click( function() {
        var newOption = $("#runningBtn").hasClass("btn-danger");
        socket.emit("option", {running: newOption});
    });

    $("#recordingBtn").click( function() {
        var newOption = $("#recordingBtn").hasClass("btn-danger");
        socket.emit("option", {recording: newOption});
    });

    $("#nightBtn").click( function() {
        var newOption = $("#nightBtn").hasClass("btn-danger");
        socket.emit("option", {night: newOption});
    });
});

$("#qualitySlider").slider();
$("#qualitySlider").on("slide", function(slideEvent) {
    $("#qualitySliderValue").text(slideEvent.value);
});
$("#qualitySlider").on("slideStop", function(slideEvent) {
    socket.emit("option", {quality: slideEvent.value});
});

$("#heightSlider").slider();
$("#heightSlider").on("slide", function(slideEvent) {
    $("#heightSliderValue").text(slideEvent.value);
});
$("#heightSlider").on("slideStop", function(slideEvent) {
    socket.emit("option", {height: slideEvent.value});
});

$("#widthSlider").slider();
$("#widthSlider").on("slide", function(slideEvent) {
    $("#widthSliderValue").text(slideEvent.value);
});
$("#widthSlider").on("slideStop", function(slideEvent) {
    socket.emit("option", {width: slideEvent.value});
});