var compatibility = (function() {

	var self = this;
	var add_to_display = [];
	var configured_display = null;
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
		document.getElementById(self.div_id).className="";

		//Display options
		self.display = options.display || 'flash,javascript,activeX,browser,popup';
		self.display_images = options.display_images || options.display;

		//Image options
		self.pass_image = options.pass_image || './images/pass.gif';
		self.fail_image = options.fail_image || './images/fail.gif';
		self.not_supported_image = options.not_supported_image || './images/not_supported.gif';

		//Flash options
		self.min_flash_version = options.min_flash_version || '11';
		self.flash_heading = options.flash_heading || 'Flash Version: ';

		//Javascript options
		self.javascript_heading = options.javascript_heading || 'Javascript: ';

		//Popup options
		self.popup_heading = options.popup_heading || 'Popup Blocker: ';

		var elements_to_display = self.display.split(",");

		for(x = 0; x < elements_to_display.length; x++) {
			if(elements_to_display[x] == 'flash') {
				getFlashPlayerVersionDotNotation();
			}

			if(elements_to_display[x] == 'javascript') {
				getJavascriptEnabled();
			}

			if(elements_to_display[x] == 'popup') {
				checkPopupBlocker();
			}

			check_requirement();
		}

		update_page();
	}

	/*********************************************************************
		These are the functions used to get the information to display
	*********************************************************************/

	var getFlashPlayerVersionDotNotation = function getFlashPlayerVersionDotNotation() {
		var playerVersion = swfobject.getFlashPlayerVersion(); // returns a JavaScript object
		add_to_display.flash_version = playerVersion.major + "." + playerVersion.minor + "." + playerVersion.release;
	}

	var getJavascriptEnabled = function getJavascriptEnabled() {
		add_to_display.javascript = 'true';
	}

	var checkPopupBlocker = function checkPopupBlocker() {
		add_to_display.popup = 'true';
	}


	/*
		This function creates a standard structure to allow manipulation of divs through CSS with the values
	*/
	var create_div_row = function(heading, message, image) {
		if(heading != null && message != null) {
			var section_to_add = "<div class='compatibility_row'><div class='compatibility_heading'>";

			section_to_add += heading + "</div><div class='compatibility_value'>" + 
				message + "</div><div class='compatibility_image'>"
				+ "<img src='" + image + "'/></div></div>";

			if(configured_display == null) {
				configured_display = section_to_add;
			} else {
				configured_display += section_to_add;
			}
		}
	}
	
	var check_requirement = function() {
		var image;
		var heading;
		var message;

		if(add_to_display.flash_version != '' && add_to_display.flash_version != null) {
			if(parseInt(add_to_display.flash_version) >= parseInt(self.min_flash_version)) {
				image = self.pass_image;
			} else {
				image = self.fail_image;
			}

			heading = self.flash_heading;
			message = add_to_display.flash_version;

			add_to_display.flash_version = null;
		}

		if(add_to_display.javascript != '' && add_to_display.javascript != null) {
			heading = self.javascript_heading;
			message = "Enabled";
			image = self.pass_image;

			add_to_display.javascript = null;
		}

		if(add_to_display.popup != '' && add_to_display.popup != null) {
			var popup = 0;
	        var myPopup = window.open("./html/popup_test.html", "_blank", "directories=no,height=150,width=150,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no,left=50");
	        heading = self.popup_heading;
	        if (!myPopup){ 
	            message = "Enabled";
	            image = self.fail_image;
	            alert("Your browser currently has a popup blocker enabled, please disable the blocker or allow popups for this website. ERROR #1");
	        } else {
	            myPopup.onload = function() {
	                setTimeout(function() {
	                    if (myPopup.screenX === 0) {
	                        message = "Enabled";
	            			image = self.fail_image;
	                        alert("Your browser currently has a popup blocker enabled, please disable the blocker or allow popups for this website. ERROR #2");
	                    } else {
	                        // close the test window if popups are allowed.
	                        this.focus();
	                        myPopup.opener = this;
	                        myPopup.close();
	                        popup = 1;
	                        message = "Enabled";
	            			image = self.pass_image;
	                    }
	                }, 0);
	            };
	        }

	        alert(heading);
	        alert(message);
	        alert(image);
	        add_to_display.popup = null;
		}

		create_div_row(heading, message, image);
	}

	var update_page = function() {
		document.getElementById(self.div_id).innerHTML = configured_display;
	}
	
	return {
		init: init
	}
}());