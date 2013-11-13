"use strict";
var NUM_SECTIONS = 3;

// Global sizing variables
var fullHeight;
var sectionHeight;
var parallaxConstant;

var Background = new function() {
	this.image = new Image();
	this.aspectRatio;
	this.node;
	this.$node;
}

$(document).ready(function() {

	Background.image = new Image();
	Background.image.src = "backgrounds/2.jpg";
	Background.node = $('#backgroundCanvas')[0];
	Background.$node = $(Background.node)
	
	Background.image.onload = function () {
		Background.aspectRatio = Background.image.height / Background.image.width;
		Background.node.width = $(window).width();
		Background.node.height = $(window).width() * Background.aspectRatio;
		onresize();
	}
});



//+++++++++++++++++++++++++++++++++++++++++++++	//
//				Scroll Throttling				//
//+++++++++++++++++++++++++++++++++++++++++++++	//

// Normalize all animation frames
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var Scroller = new function() {

	this.scrollTimeout;
	this.latestKnownScrollY;
	var ticking = false;

	this.requestTick = function() {
		if(!ticking) {
			requestAnimationFrame(update);
		}
		ticking = true;
		// update();
	}

	var update = function() {
		// console.log('upd');
		ticking = false;
		var currentScrollY = Scroller.latestKnownScrollY;
		var newPosition = parallaxConstant * currentScrollY;

		// catch bounce overflow 
		if( newPosition >= (fullHeight - Background.node.height) )
			newPosition = fullHeight - Background.node.height;
		
		Background.$node.css('top', newPosition);
	}
}

//+++++++++++++++++++++++++++++++++++++++++++ //
//		  	     Window Events	  	  	      //		 
//+++++++++++++++++++++++++++++++++++++++++++ //

window.onresize = function(resizeEvent) {

	var update_background = function() {

		Background.node.width = $(window).width();
		Background.node.height = $(window).width() * Background.aspectRatio;

		// Draw image onto canvas
		var dst_ctx = Background.node.getContext('2d');
		dst_ctx.drawImage(Background.image, 0, 0, Background.node.width, Background.node.height);

	}

	// Set sizing variables
	sectionHeight = $('.section').height();
	fullHeight = sectionHeight * NUM_SECTIONS;
	parallaxConstant = (fullHeight - Background.node.height) / (fullHeight - $(window).height() );
	update_background();
}

window.onscroll = function(scrollEvent) {
	Scroller.latestKnownScrollY = window.scrollY;
	Scroller.requestTick();
}