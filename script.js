"use strict";

// Constants
var sectionHeaders = ['title', 'about', 'services', 'rates'];

// Image variables
var backgroundImage = new Image();
backgroundImage.src = "backgrounds/2.jpg"; 
var imageWidth;
var imageHeight;
var aspectRatio;				// The apect ratio of our background image

// Size variables
var windowHeight;		
var fullHeight;
var windowWidth;
var backgroundHeight; 
var parallaxConstant;

// For scroll debouncing
var latestKnownScrollY = 0;
var ticking = false;

// Cached for speed
var $canvas;

$(document).ready(function() {

	$canvas = $('#backgroundCanvas');

	backgroundImage.onload = function () {
		imageWidth = this.width;
		imageHeight = this.height;
		aspectRatio = imageHeight/imageWidth;

		initialize();
	}
});

function initialize() {
	windowHeight = $(window).height();
	windowWidth = $(window).width();
	fullHeight = $(document).height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
	update_canvas(backgroundImage);
	color_panels();
	window.onresize();

	window.setTimeout(function(){ 
		$('.sections .panel').fadeTo(500, 0.45, 'easeInQuart', function() {
			$(this).fadeTo(500, 0.25, 'easeOutQuart');
			$('.content').fadeTo(500, 1);
		});
	}, 1500);

	window.setTimeout(function(){
		console.log(scrollY);
		var panelPosition = -1*Math.round(fullHeight/(scrollY+windowHeight/2))+5;
		if (panelPosition < 1) panelPosition = 1;
		console.log(panelPosition);
		go_section(panelPosition);
	}, 500);
}

function color_panels() {
	$('.sections .panel').each(function(i, e){
		var hue = Math.round(Math.random()*360);
		var saturation = Math.round(Math.random()*20) + 80;
		var lightness = Math.round(Math.random()*10) + 50;
		var color = 'hsl('+hue+','+saturation+'%,'+lightness+'%)'; 
		$(this).css('background-color', color);
	});
}

function update_canvas(imageObject, height, width) {
    // New canvas
    var canvas = $('#backgroundCanvas')[0];
    canvas.width = windowWidth;
    canvas.height = Math.round(canvas.width * aspectRatio);

    // Draw Image content in canvas
    var dst_ctx = canvas.getContext('2d');
    dst_ctx.drawImage(imageObject, 0, 0, canvas.width, canvas.height);
}

function go_section(sectionNumber) {
	var top = 2*(sectionNumber-1)*windowHeight + windowHeight/2;
	$.scrollTo(top, 1000, {'easing': 'easeInOutCubic'});
}


function requestTick() {
	if(!ticking) {
		requestAnimationFrame(update);
	}
	ticking = true;
}

function update() {

	ticking = false;

	var currentScrollY = window.scrollY;
	var newPosition = Math.round(parallaxConstant*currentScrollY);

	$canvas.css('top', newPosition);
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
	$('html').css('font-size', Math.round(windowWidth/30)+'px');
	window.onscroll();
}