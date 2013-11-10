"use strict";

var background = new background();

function background() {
	this.image = new Image();
	this.image.aspectRatio;
	this.node;
	this.width;
	this.height;
}

$(document).ready(function() {

	background.image = new Image();
	background.image.src = "backgrounds/2.jpg";
	background.node = $('#backgroundCanvas')[0];
	
	background.image.onload = function () {
		background.image.aspectRatio = background.image.height / background.image.width;
	}
});

function update_background() {

	background.node.width = $(window).width();
	background.node.height = $(window).width() * background.image.aspectRatio;

	// Draw image onto canvas
	var dst_ctx = background.node.getContext('2d');
	dst_ctx.drawImage(background.image, 0, 0, background.node.width, background.node.height)
}

//+++++++++++++++++++++++++++++++++++++++++++ //
//		  	     Window Events	  	  	      //		 
//+++++++++++++++++++++++++++++++++++++++++++ //

window.onresize = function(resizeEvent) {
	update_background();
}