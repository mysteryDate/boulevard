$(document).ready(function() {

	var backgroundImage = new Image();
	backgroundImage.src = "background.jpg"; 

	backgroundImage.onload = function () {
		$('body').css('background-image', 'url("background.jpg")');
	};
});