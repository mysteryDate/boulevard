//+++++++++++++++++++++++++++++++++++++++++++ //
//	  	     Background Canvas Class	  	  //		 
//+++++++++++++++++++++++++++++++++++++++++++ //

function BackgroundCanvas(args)
{
	var _self = this;

	this.image = new Image();
	this.image.src = args['src'];

	// Sizing variables
	this.width = this.image.width;
	this.height = this.image.height;
	this.aspectRatio = this.height/this.width;

	this.node = $('#backgroundCanvas')[0];
}

BackgroundCanvas.prototype = {

	// Draws the canvas in the proper dimensions
	// Always fits the width of the viewport
	// and overflows beneath
	draw : function()
	{
		this.width = $(window).width();
		this.height = this.width * aspectRatio;

		var dst_ctx = this.node.getContext('2d');
		dst_ctx.drawImage(this.image, 0, 0, this.width, this.height);
	} 
}