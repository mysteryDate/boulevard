"use strict";

// Constants
var sectionHeaders = {
	'English': ['Fran\xE7ais', 'Services', 'Contact Us'],
	'French': ['English', 'Services', 'Contactez-Nous']
};
var numSections = 3;

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
var sectionHeight;

// For scroll debouncing
var latestKnownScrollY = 0;
var ticking = false;

// Cached for speed
var $canvas;
var $footer;

// User variables
var language = 'english';
var browser = test_browser();

// For window snapping
var scrollTimeout;
var currentViewState;


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

function initialize() {
	set_sizing_variables();
	update_canvas(backgroundImage);
	color_panels();
	window.onresize();

	if( browser == 'Chrome')
		$('#backgroundCanvas').css('position', 'absolute');
	else
		$('#backgroundCanvas').css('position', 'fixed');

	window.setTimeout(function(){ 
		$('.sections .panel').fadeTo(500, 0.75, 'easeInQuart', function() {
			$(this).fadeTo(500, 0.25, 'easeOutQuart');
			$('.content').fadeTo(500, 1);
		});
	}, 600);

	window.setTimeout(function(){
		go_section(get_view_state(), 100);
	}, 500);

	add_handlers();
	set_language('English');
}

function set_sizing_variables() {
	windowHeight = $(window).height();
	// $('body').css('height', windowHeight*2*numSections);
	windowWidth = $(window).width();
	sectionHeight = $('.sections').height();
	fullHeight = sectionHeight*numSections;
	footerHeight = $footer.height();
	backgroundHeight = windowWidth * aspectRatio;
	parallaxConstant = (fullHeight - backgroundHeight)/(fullHeight - windowHeight);
}

function color_panels() {
	var hue = Math.round(Math.random()*360);	
	$('.sections .panel').each(function(i, e){
		var saturation = Math.round(Math.random()*20) + 80;
		var lightness = Math.round(Math.random()*20) + 20;
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

	currentViewState = get_view_state();
	if( currentViewState == sectionNumber && get_view_distance() == 0) return;

	var top = 2*(sectionNumber-1)*windowHeight + windowHeight/2;
	if( !time ) {
		time = Math.abs(sectionNumber - currentViewState) * 1000;
	}
	$.scrollTo(top, time, {'easing': 'easeInOutCubic'});
	if ( sectionNumber == 1 ) {
		$footer.slideUp();
	}
	else {
		$footer.slideDown();
		footerHeight = $footer.children('.button').height();
		var footerPosition = scrollY+windowHeight-footerHeight;
		$footer.css('top', footerPosition);
	}
}

function set_language(language) {

	var titleText = sectionHeaders[language];

	$('.sectionTitle h1').each(function(index,element){
		$(element).text(titleText[index+1]);
	});

	$('#navBar div.button').each(function(index,element) {
		$(element).text(titleText[index]);
	});

	$('.text').each(function(index,element){
		var filename = element.id + '.txt';
		$.get('content/'+language+'/'+filename, function(data) {
			$(element).text(data);
		});
	});

	set_sizing_variables();
}

function get_view_state() {
	return Math.floor( (scrollY + windowHeight/2) /sectionHeight) + 1;
}

function get_view_distance() {
	var state = get_view_state();
	return scrollY - ( state*sectionHeight - (sectionHeight+windowHeight)/2);
}

function test_browser() {
	if( navigator.userAgent.toLowerCase().indexOf('chrome') >-1 ) return 'Chrome';
	else if( navigator.userAgent.toLowerCase().indexOf('safari') >-1 ) return 'Safari';
	else if( navigator.userAgent.toLowerCase().indexOf('msie') >-1 ) return 'IE';
	else if( navigator.userAgent.toLowerCase().indexOf('firefox') >-1 ) return 'Firefox';
	else if( navigator.userAgent.toLowerCase().indexOf('presto') >-1 ) return 'Opera';
}

function start_scroll_timer() {
	scrollTimeout = window.setTimeout(function(){
		var state = get_view_state();
		go_section(state, 400);
	}, 200);
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

	console.log('update');
	ticking = false;

	if(browser == "Chrome") {
		var currentScrollY = window.scrollY;
		if (currentScrollY > fullHeight - windowHeight) currentScrollY = fullHeight - windowHeight;
		var newPosition = Math.round(parallaxConstant*currentScrollY);

		$canvas.css('top', newPosition);
		var footerPosition = currentScrollY+windowHeight-footerHeight;
		if (footerPosition > fullHeight - footerHeight) footerPosition = fullHeight - footerHeight;
		$footer.css('top', footerPosition);
	}
}

window.onscroll = function(e) {

	clearTimeout(scrollTimeout);
	latestKnownScrollY = window.scrollY;
	requestTick();
	start_scroll_timer();
	//update();

}

window.onresize = function(e) {
	console.log('onresize');
	set_sizing_variables();
	update_canvas(backgroundImage);
	$('body').css('font-size', Math.round(windowWidth/30)+'px');
	console.log(windowWidth/30);
	$('.container').height(windowHeight);
	$('.sections .content').css('height', 'calc(100% - ' + (footerHeight+$('.sectionTitle').height()) +'px)');
	$('#servicesText').css('height', 'calc(100% - ' + $('#servicesNav').height()+'px)');
	window.onscroll();
}

// Event handlers
function add_handlers() {
	$('#languageSelection h2').on('click', function() {
		language = $(this).text();
		// Stupid hack because of the special character in the word 'Français'
		if (language != 'English') language = 'French';
		set_language(language);
		go_section(2, 2000);
	});

	$('#navBar').on('click', 'div.button', function(){
		go_section($(this).index()+1);
	})

	$('#servicesNav').on('click', '.tab', function(){
		$('#servicesNav .tab').removeClass('selected');
		$(this).addClass('selected');

		var filename = this.id + '.html';
		$.get('content/'+language+'/'+filename, function(data) {
			$('#servicesText').empty().append(data);
		});
	});
}