"use strict";

// Constants
var sectionHeaders = {
	'English': ['Fran\xE7ais', 'About Us', 'Services', 'Rates'],
	'French': ['English', '\xC0 Propos De Nous', 'Services', 'Tarifs']
};

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
var footerHeight;

// For scroll debouncing
var latestKnownScrollY = 0;
var ticking = false;

// Cached for speed
var $canvas;
var $footer;

// User variables
var language;
var browser = test_browser();
console.log(browser);

$(document).ready(function() {

	$canvas = $('#backgroundCanvas');
	$footer = $('#navBar');


	backgroundImage.onload = function () {
		imageWidth = this.width;
		imageHeight = this.height;
		aspectRatio = imageHeight/imageWidth;

		initialize();
	}
});

function set_sizing_variables() {
	windowHeight = $(window).height();
	windowWidth = $(window).width();
	fullHeight = $(document).height();
	footerHeight = $footer.children().height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
}

function initialize() {
	set_sizing_variables();
	update_canvas(backgroundImage);
	color_panels();
	$('.content').append('<div class="blurPanel"></div>');
	window.onresize();

	window.setTimeout(function(){ 
		$('.sections .panel').fadeTo(500, 0.45, 'easeInQuart', function() {
			$(this).fadeTo(500, 0.25, 'easeOutQuart');
			$('.content').fadeTo(500, 1);
		});
	}, 600);

	window.setTimeout(function(){
		var panelPosition = -1*Math.round(fullHeight/(scrollY+windowHeight/2))+5;
		if (panelPosition < 1) panelPosition = 1;
		go_section(panelPosition, 100);
	}, 500);

	add_handlers();
	set_language('English');
}

function color_panels() {
	var hue = Math.round(Math.random()*360);	
	$('.sections .panel').each(function(i, e){
		var saturation = Math.round(Math.random()*20) + 80;
		var lightness = Math.round(Math.random()*20) + 40;
		var color = 'hsl('+hue+','+saturation+'%,'+lightness+'%)'; 
		$(this).css('background-color', color);
		hue = hue + 70 + Math.round(Math.random()*40);
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

function go_section(sectionNumber, time) {
	var top = 2*(sectionNumber-1)*windowHeight + windowHeight/2;
	$.scrollTo(top, time, {'easing': 'easeInOutCubic'});
}


(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

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
	var footerPosition = currentScrollY+windowHeight-footerHeight;
	if (footerPosition > fullHeight - footerHeight) footerPosition = fullHeight - footerHeight;
	$footer.css('top', footerPosition);
}

window.onscroll = function(e) {

	latestKnownScrollY = window.scrollY;
	requestTick();
	//update();

}

window.onresize = function(e) {

	set_sizing_variables();
	update_canvas(backgroundImage);
	$('html').css('font-size', Math.round(windowWidth/30)+'px');
	window.onscroll();
}

function set_language(language) {

	var titleText = sectionHeaders[language];

	$('.sectionTitle h1').each(function(index,element){
		$(element).text(titleText[index+1]);
	});

	$('#navBar div').each(function(index,element) {
		$(element).text(titleText[index]);
	});

	$('.text').each(function(index,element){
		var filename = element.id + language + '.txt';
		$.get('content/'+filename, function(data) {
			$(element).text(data);
		});
	});

	set_sizing_variables();
}

// Event handlers
function add_handlers() {
	$('#languageSelection h2').on('click', function() {
		language = $(this).text();
		// Stupid hack because of the special character in the word 'Français'
		if (language != 'English') language = 'French';
		set_language(language);
		go_section(2, 2000);
		console.log('aya')
	});

	$('#navBar').on('click', 'div', function(){
		console.log($(this).index())
		go_section($(this).index()+1, 1000);
	})
}

function test_browser() {

	if( navigator.userAgent.toLowerCase().indexOf('chrome') >-1 ) return 'Chrome';
	else if( navigator.userAgent.toLowerCase().indexOf('safari') >-1 ) return 'Safari';
	else if( navigator.userAgent.toLowerCase().indexOf('msie') >-1 ) return 'IE';
	else if( navigator.userAgent.toLowerCase().indexOf('firefox') >-1 ) return 'Firefox';
	else if( navigator.userAgent.toLowerCase().indexOf('presto') >-1 ) return 'Opera';
}