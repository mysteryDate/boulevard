"use strict";

// Contains global variables for the page
var numSections = 4;
var sectionTitles = ['title', 'about', 'services', 'rates'];
var language = 'english';
var viewState = sectionTitles[0];

var backgroundImage = new Image();
backgroundImage.src = "background.jpg"; 

var aspectRatio = 1.5;	// Made this up
var totalHeight = aspectRatio * $(window).width(); 
var windowHeight = $(window).height();		// Just so it only runs once
var divisionDistance = (totalHeight - windowHeight) / (numSections - 1);		// Should be total height over number of sections, I need to fiture out what total height is

var sectionHeight;
var sections = [];

// Each frame on the page
function section(name, number) {

	var self = this;
	this.$self;			// A jquery object for the section itself
	this.name = name;

	this.mark = divisionDistance * number;		// The y value (in pixels) of the top of the frame when centered
	this.yPos;

	this.position = function() {
		this.$self.css('top', self.yPos);
	}

}

$(document).ready(function() {

	// Create all of the sections
	for (var i = 0; i < numSections; i++) {
		var title = sectionTitles[i]
		sections[i] = new section(title, i);
		$('body').append('<div class="sections" id='+title+'>');
		sections[i].$self = $('#'+title);
	};

	backgroundImage.onload = function () {
		$('body').css('background-image', 'url("background.jpg")');

		for (var i = 0; i < numSections; i++) {
			
			$('body').append(sections[i]);
		};

		$('.sections').each(function(i, element) {
			$(this).css('top', $(window).height()*i);
			$(this).append("<h1>"+sectionTitles[i]+"</h1>");
		});

		$('body').append(
			"<div class='titleDiv' id='traduction'>traduction</div>"+
			"<div class='titleDiv' id='boulevard'>BOULEVARD</div>"+
			"<div class='titleDiv' id='translation'>translation</div>"
		);

	};
});

window.onresize = function (e) {

	totalHeight = aspectRatio * $(window).width(); 	// Const should be the apsect ratio of the background
	windowHeight = $(window).height();		// Just so it only runs once
	divisionDistance = (totalHeight - windowHeight) / (numSections - 1);	// Should be total height over number of sections, I need to fiture out what total height is

	//$('body').css('height', totalHeight+'px');

	for (var i = 0; i < sections.length; i++) {
		sections[i].mark = divisionDistance*i;
		sections[i].position();
	};
	// change total height and div distance and marks
}

window.onscroll = function(e) {
	position_panels();
	console.log("scroll");
}

function position_panels() {

	// top = -(scrollY + window.width)(scrollY - D^2*num)^-5(scrollY - D*num)^5
	// D = total height / number of frames
	// num = the numeric position of that frame (starting at 0)

	var scrollY = window.scrollY;

	for (var i = 0; i < sections.length; i++) {

		var $frame = sections[i].$self;
		var mark = sections[i].mark;
		var disp = mark - scrollY;		// Displacement of the centering frame from view

		// To avoid a quintic calulation for sections out of the frame
		//if ( disp > divisionDistance || disp < -divisionDistance ) {
		//	$frame.css('display', 'none');	
		//}
		//else {
		//	$frame.css('display', 'block');
			var m = (divisionDistance - windowHeight) / divisionDistance;
			var b = windowHeight * i;
			var t = m * scrollY + b;
			sections[i].$self.css('top', t+'px');
		//}
	};

	
}

function find_height(scrollY, mark, divisionDistance) {

	var m = -(scrollY + windowHeight)/(divisionDistance + mark);
	var y = m * (scrollY - mark);
	var top = y + scrollY;

	return top;
}