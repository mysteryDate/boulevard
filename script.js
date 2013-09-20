"use strict";

// Constants
var numSections = 5;
var sectionHeaders = ['title', 'about', 'services', 'rates'];
var aspectRatio = 1.4;				// The apect ratio of our background image
var backgroundImage = new Image();
backgroundImage.src = "background_mono.jpg"; 

// Size variables
var windowHeight;		
var fullHeight;
var windowWidth;
var backgroundHeight; 
var parallaxConstant;

var $body;

$(document).ready(function() {

	// Size variables
	//windowHeight = $('#'+sectionHeaders[0]).height();
	//windowWidth = $('#'+sectionHeaders[0]).width();
	//fullHeight = $(window).height();
	//backgroundHeight = windowWidth * aspectRatio;
	//parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);

	backgroundImage.onload = function () {
		$body = $('body');
		$body.css('background-image', 'url("background_mono.jpg")');

		window.onresize();

		$('.sections').each(function(i, e){
			var red = Math.round(Math.random()*255);
			var green = Math.round(Math.random()*255);
			var blue = Math.round(Math.random()*255);
			var color = 'rgb('+red+','+green+','+blue+')';
			$(this).css('background-color', color);
			$(this).fadeTo(500, 0.3);
		});

	}
});

window.onscroll = function(e) {

	var newPosition = parallaxConstant*scrollY;
	$("body").css('background-position', 'center '+newPosition+'px');

	//$('.sections').each(function(i, e){
	//	$(this).css('top', newPosition);
	//});

}

window.onresize = function(e) {

	windowHeight = $('#'+sectionHeaders[0]).height();
	windowWidth = $('#'+sectionHeaders[0]).width();
	fullHeight = $(window).height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
	//parallaxConstant = (fullHeight - backgroundHeight)/(backgroundHeight - windowHeight);
	window.onscroll();
}