"use strict";

// Constants
var numSections = 5;
var sectionHeaders = ['title', 'about', 'services', 'rates'];
var aspectRatio = 1.4;				// The apect ratio of our background image
var backgroundImage = new Image();
backgroundImage.src = "background2.jpg"; 

// Size variables
var windowHeight;		
var fullHeight;
var windowWidth;
var backgroundHeight; 
var parallaxConstant;

// For scroll debouncing
var latestKnownScrollY = 0;
var ticking = false;

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
		$body.css('background-image', 'url("background2.jpg")');

		window.onresize();

		$('.sections').each(function(i, e){
			/*
			var hue = Math.round(Math.random()*360);
			var saturation = Math.round(Math.random()*100);
			var lightness = Math.round(Math.random()*100);
			var color = 'hsl('+hue+','+saturation+'%,'+lightness+'%)'; */
			var r = Math.round(Math.random()*255);
			var g = Math.round(Math.random()*255);
			var b = Math.round(Math.random()*255);
			var color = 'rgb('+r+','+g+','+b+')';
			$(this).css('background-color', color);
			$(this).fadeTo(500, 0.25);
		});

	}
});


window.onscroll = function(e) {

	latestKnownScrollY = window.scrollY;
	requestTick();
	//update();

	//var currentScrollY = latestKnownScrollY;
	//var newPosition = parallaxConstant*scrollY;
	//$("body").css('background-position', 'center '+newPosition+'px');


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

function requestTick() {
	if(!ticking) {
		requestAnimationFrame(update);
	}
	ticking = true;
}

function update() {
	ticking = false;

	var currentScrollY = latestKnownScrollY;
	var newPosition = parallaxConstant*scrollY;
	$body.css('background-position', 'center '+newPosition+'px');

}
