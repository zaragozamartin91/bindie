$(document).ready(function() {

	$(document).on("click", ".playSong", function(){

	var songUrl = $(this).data("songurl");

	$(player).empty();
	$('<audio id="playerAudio" controls="controls"><source src="' + songUrl + '" type="audio/mpeg">Tu Browser no soporta el elemento "audio" de HTML5.</audio>').appendTo($(player));
	$("#playerAudio").convertAudioPlayer();
	});

});