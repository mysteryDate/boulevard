"use strict";

var backgroundImage = new Image();
backgroundImage.src = "background.jpg"; 

$(document).ready(function() {

	backgroundImage.onload = function () {
		$('body').css('background-image', 'url("background.jpg")');
	}
});

window.onscroll = function(e) {

	$('body').css('background-position', 'center '+window.scrollY/2+'px');

}
