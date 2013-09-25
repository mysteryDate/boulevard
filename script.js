"use strict";

// Constants
var numSections = 5;
var sectionHeaders = ['title', 'about', 'services', 'rates'];
var aspectRatio;				// The apect ratio of our background image
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

var $canvas;
var timerRunning = false;

$(document).ready(function() {

	$canvas = $('#backgroundCanvas');

	backgroundImage.onload = function () {
		imageWidth = this.width;
		imageHeight = this.height;
		aspectRatio = imageHeight/imageWidth;

		$('.sections').each(function(i, e){
			var hue = Math.round(Math.random()*360);
			var saturation = Math.round(Math.random()*20) + 80;
			var lightness = Math.round(Math.random()*10) + 50;
			var color = 'hsl('+hue+','+saturation+'%,'+lightness+'%)'; 
			/*var r = Math.round(Math.random()*255);
			var g = Math.round(Math.random()*255);
			var b = Math.round(Math.random()*255);
			var color = 'rgb('+r+','+g+','+b+')';*/
			$(this).css('background-color', color);
		});

		initialize();

		window.setTimeout(function(){ 
			$('.sections').each(function(i,e){
				$(this).fadeTo(500, 0.45, 'easeInQuart', function() {
					$(this).fadeTo(500, 0.25, 'easeOutQuart');
				});
			});
		}, 500);

	}
});


function update_canvas(imageObject, height, width) {
    // New canvas
    var canvas = $('#backgroundCanvas')[0];
    canvas.width = windowWidth;
    canvas.height = Math.round(canvas.width * aspectRatio);

    // Draw Image content in canvas
    var dst_ctx = canvas.getContext('2d');
    dst_ctx.drawImage(imageObject, 0, 0, canvas.width, canvas.height);

}

function initialize() {
	windowHeight = $(window).height();
	windowWidth = $(window).width();
	fullHeight = $(document).height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
	update_canvas(backgroundImage);
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
	onscroll();
}

function requestTick() {
	if(!ticking) {
		requestAnimationFrame(update);
	}
	else {
		console.log('tick');
	}
	ticking = true;
}

function update() {
	ticking = false;

	var currentScrollY = latestKnownScrollY;
	var newPosition = Math.round(parallaxConstant*scrollY);

	var oldPosition = parseInt($canvas.css('top'));

	$canvas.css('top', newPosition);
	//moveCanvas(newPosition, oldPosition);
}

function moveCanvas(newPosition, oldPosition) {
	if (!timerRunning) {
		timerRunning = true;
		var time = Math.abs(newPosition - oldPosition);
		$canvas.animate({'top': newPosition}, 50, 'linear', function() {
			timerRunning = false;
		});
	}
	else console.log('a');
}

