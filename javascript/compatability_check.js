var compatibility = (function() {

	var self = this;

	/*
		@param:div_id - specifies which div is going to be replaced with the content
		@param:options.display - items that we want to display, choices are [flash, javascript, activeX, browser, popup]
		@param:display_images - if user wants to display images with compatibility, they can pass only the specific ones to show images, defaults to selection passed originally
		@param:pass_image - allows user to change default pass image, default is a green dot
		@param:fail_image - allows user to change default fail image, default is a red dot
		@param:not_supported_image - allows user to change default not supported image, default is a yellow dot
		@param:min_flash_version - lets the user set the minimum flash version to pass
	*/
	var init = function (options) {
		self.div_id = options.div_id || "compatibility";
		self.display = options.display || 'flash,javascript,activeX,browser,popup';
		self.display_images = options.display_images || options.display;
		self.pass_image = options.pass_image || './images/pass.gif';
		self.fail_image = options.fail_image || './images/fail.gif';
		self.not_supported_image = options.not_supported_image || './images/not_supported.gif';
		self.min_flash_version = options.min_flash_version || '11';

		update_page();
	}

	var update_page = function() {
		document.getElementById(self.div_id).innerHTML = "<div>" + self.display + "</div>";
		document.getElementById(self.div_id).innerHTML += "<img src='"+self.pass_image+"'/>"
	}
	
	return {
		init: init
	}
}());