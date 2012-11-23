/*var compatibility = {
	
		@param:options.display - allows the user to pass which compatibility items they want to display, choices are [flash, javascript, activeX, browser, popup]
	
	init:function(options) {
		this.display = options.display || 'flash,javascript,activeX,browser,popup';
		//alert(this.display);
		alertUser();
	},
	alertUser:function() {
		alert(this.display);
	}
}; */

var compatibility = (function() {

	var self = this;

	/*
		@param:options.display - items that we want to display, choices are [flash, javascript, activeX, browser, popup]
	*/
	var init = function (options) {
		self.display = options.display || 'flash,javascript,activeX,browser,popup';
	}
	
	return {
		init: init
	}
}());