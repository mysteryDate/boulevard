"use strict";

// Constants
var numSections = 5;
var sectionHeaders = ['title', 'about', 'services', 'rates'];
var aspectRatio = 1.4;				// The apect ratio of our background image
var backgroundImage = new Image();
backgroundImage.src = "backgrounds/2.jpg"; 
var imageWidth;
var imageHeight;

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

	backgroundImage.onload = function () {
		imageWidth = this.width;
		imageHeight = this.height;
		initialize();
		$body = $('body');
		$body.css({
			//'background-image': 'url('+backgroundImage.src+')',
			//'height': fullHeight
		});


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

function update_canvas(imageObject, height, width) {
    // New canvas
    var canvas = $('#backgroundCanvas')[0];
	var newWidth = $(canvas).width();
	var newHeight = $(canvas).height();

	// Calculate a new scale
    // The new scale will be the minimum of the two possible scales
    var scale = newHeight / imageObject.height;//newWidth / imageObject.width;

    // Draw Image content in canvas
    var dst_ctx = canvas.getContext('2d');
    dst_ctx.drawImage(imageObject, 0, 0, height, width);

}

function initialize() {
	windowHeight = $(window).height();
	windowWidth = $(window).width();
	fullHeight = $(document).height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
	//parallaxConstant = (fullHeight - backgroundHeight)/(backgroundHeight - windowHeight);
}

window.onscroll = function(e) {

	latestKnownScrollY = window.scrollY;
	requestTick();

}

window.onresize = function(e) {

	windowHeight = $(window).height();
	windowWidth = $(window).width();
	fullHeight = $(document).height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
	update_canvas(backgroundImage);
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

function resizeImage(imageObject, width, height) {
    var newWidth = width;
    var newHeight = height;

    // Calculate a new scale
    // The new scale will be the minimum of the two possible scales
    var scale = Math.min((newWidth / imageObject.width), (newHeight / imageObject.height));

    // New canvas
    var dst_canvas = document.createElement('canvas');
    dst_canvas.width = imageObject.width * scale;
    dst_canvas.height = imageObject.height * scale;

    // Draw Image content in canvas
    var dst_ctx = dst_canvas.getContext('2d');
    dst_ctx.drawImage(imageObject, 0, 0, parseInt(imageObject.width * scale), parseInt(imageObject.height * scale));

    // Replace source of Image
    imageObject.src = dst_canvas.toDataURL();
}
