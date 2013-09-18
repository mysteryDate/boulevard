"use strict";

// Contains global variables for the page
var numSections = 4;
var sectionTitles = ['title', 'about', 'services', 'rates'];
var language = 'english';
var viewState = sectionTitles[0];

var backgroundImage = new Image();
backgroundImage.src = "background.jpg"; 

var totalHeight = 1.2 * $(window).width(); 	// Const should be the apsect ratio of the background
var divisionDistance = totalHeight / numSections;		// Should be total height over number of sections, I need to fiture out what total height is
var windowHeight = $(window).height();		// Just so it only runs once

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

	var totalHeight = 1.2 * $(window).width(); 	// Const should be the apsect ratio of the background
	var divisionDistance = totalHeight / numSections;		// Should be total height over number of sections, I need to fiture out what total height is
	var windowHeight = $(window).height();		// Just so it only runs once

	for (var i = 0; i < sections.length; i++) {
		sections[i].mark = divisionDistance*i;
		sections[i].position();
	};
	// change total height and div distance and marks
}

window.onscroll = function(e) {
	position_panels();
}

function position_panels() {

	// top = -(scrollY + window.width)(scrollY - D^2*num)^-5(scrollY - D*num)^5
	// D = total height / number of frames
	// num = the numeric position of that frame (starting at 0)

	var scrollY = window.scrollY;

	for (var i = 0; i < sections.length; i++) {

		var $frame = sections[i].$self;
		var mark = sections[i].mark;
		var disp = mark - scrollY;		// Displacement of the current frame from view

		// To avoid a quintic calulation for sections out of the frame
		if ( disp > windowHeight || disp < -windowHeight ) $frame.css('display', 'none');		
		
		else {
			$frame.css('display', 'block');
			var b = i * windowHeight;
			var m = windowHeight / divisionDistance;
			var y = m * scrollY - b;
			sections[i].$self.css('top', (scrollY - y)+'px');
		}
	};

	
}