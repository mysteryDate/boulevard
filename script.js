"use strict";

// Contains global variables for the page
var numSections = 4;
var sectionTitles = ['title', 'about', 'services', 'rates'];
var language = 'english';
var viewState = sectionTitles[0];

var backgroundImage = new Image();
backgroundImage.src = "background.jpg"; 

var sectionHeight;
var sections = [];

// Each frame on the page
function section(name) {

	this.$self;			// A jquery object for the section itself
	this.name = name;

	this.postion;		// The y value (in pixels) of the top of the frame when centered

	this.center = function() {
		var yPosition = window.scrollY;
		this.$self.css('top', yPosition);
	}

}

$(document).ready(function() {

	console.log(backgroundImage.clientHeight);


	// Create all of the sections
	for (var i = 0; i < numSections; i++) {
		var title = sectionTitles[i]
		sections[i] = new section(title);
		$('body').append('<div class="sections" id='+title+'>');
		sections[i].$self = $('#'+title);
	};

	backgroundImage.onload = function () {
		$('body').css('background-image', 'url("background.jpg")');

		console.log(backgroundImage.clientHeight);
		var sections = []

		for (var i = 0; i < numSections; i++) {
			
			$('body').append(sections[i]);
		};

		$('.sections').each(function(i, element) {
			$(this).css('top', $(window).height()*i);
			$(this).append("<h1>"+sectionTitles[i]+"</h1>");
			console.log(this, i, element);
		});

		$('body').append(
			"<div class='titleDiv' id='traduction'>traduction</div>"+
			"<div class='titleDiv' id='boulevard'>BOULEVARD</div>"+
			"<div class='titleDiv' id='translation'>translation</div>"
		);

	};
});

window.onresize = function (e) {
	$('.sections').each(function(index, element) {
		$(this).css({
			'top': $(window).height()*index
		});
	});
}

window.onscroll = function(e) {
	position_panels();
}

function position_panels() {

	var totalHeight = 1.2 * $(window).width(); 	// 1.5 should be the apsect ratio of the background
	var divisionDistance = totalHeight / numSections;		// Should be total height over number of sections, I need to fiture out what total height is
	var windowHeight = $(window).height();		// Just so it only runs once
	var scrollY = window.scrollY;

	for (var i = 0; i < sections.length; i++) {
		var b = i * windowHeight;
		var m = windowHeight / divisionDistance;
		var y = m * scrollY - b;
		if (i == 2) {console.log(sections[2].name, y, y-window.scrollY, window.scrollY);};
		sections[i].$self.css('top', (scrollY - y)+'px');
	};

	
}