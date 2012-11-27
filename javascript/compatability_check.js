var compatibility = (function() {

	var self = this;
	var add_to_display = [];
	var configured_display = [];
	var popup_position = null;
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
		self.display = options.display || 'flash,javascript,browser,activeX,popup';
		self.display_images = options.display_images || options.display;
		self.compatibility_title = options.compatibility_title || "Compatibility Check";

		//Color options can be either normal colors like 'red' or 'green' OR they can be their HEX values
		//a HEX value like #CC0000 for a crimson red
		self.background_color1 = options.background_color1 || "white";
		self.background_color2 = options.background_color2 || "rgb(215, 233, 245)";

		self.compatibility_update = options.compatibility_update || null;
		console.log(self.compatibility_update);

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

		//ActiveX options
		self.activeX_heading = options.activeX_heading || 'ActiveX: ';

		//Browser options
		self.browser_heading = options.browser_heading || 'Browser: ';
		self.supported_browsers = options.supported_browsers || 'Chrome,Firefox,MSIE,Safari';

		configured_display.push("<div class='compatibility_title'>" + self.compatibility_title + "</div>");
		var elements_to_display = self.display.split(",");
		var display_popup = false;

		for(x = 0; x < elements_to_display.length; x++) {
			if(elements_to_display[x] == 'flash') {
				getFlashPlayerVersionDotNotation();
			}

			if(elements_to_display[x] == 'javascript') {
				getJavascriptEnabled();
			}

			if(elements_to_display[x] == 'popup') {
				display_popup = true;
				popup_position = x + 1;
				add_to_display.popup = 'temp';
			}

			if(elements_to_display[x] == 'activeX') {
				getActiveXEnabled();
			}

			if(elements_to_display[x] == 'browser') {
				getBrowser();
			}

			//alert(elements_to_display[x]);

			check_requirement();
		}

		if(display_popup == true) {
			display_popup = false;
			getPopupBlockerEnabled();
			check_requirement();
		}

		//updateCompatabilityDisplayLook();
		//update_page();
	}

	function getStyle(x, styleProp) {
        if (x.currentStyle) { 
        	var y = x.currentStyle[styleProp]; 
        } else if (window.getComputedStyle) {
        	var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);	
        } 
        return y;
    }

	var updateCompatabilityDisplayLook = function updateCompatabilityDisplayLook() {
		var div = document.getElementById(self.div_id);

		if(self.background_color1 != 'white' || self.background_color2 != 'rgb(215, 233, 245)') {
			var background = getStyle(div, 'background');
			background = background.replace(/white/g, self.background_color1);
			background = background.replace(/rgb\(215, 233, 245\)/g, self.background_color2);
			div.style.background = background;
		}

		for(var key in self.compatibility_update) {
			var split = key.split("_");
			var class_divs = document.getElementsByClassName('compatibility_' + split[0]);

			//console.log(class_divs);

			for(var divs in class_divs) {
				if(class_divs[divs].style) {
					if(parseInt(self.compatibility_update[key])){
						self.compatibility_update[key] = parseInt(self.compatibility_update[key]) + 'px';
					}
					class_divs[divs].style.setProperty(split[1], self.compatibility_update[key], '');
				}
			}
		}
		
		/*for(y = 0; y < class_divs.length; y++) {
			var color = getStyle(class_divs[y], 'color');
			color = color.replace(/rgb\(0, 0, 0\)/g, 'red');
			class_divs[y].style.color = color;
		}*/
		//console.log(class_divs);
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

	var getPopupBlockerEnabled = function getPopupBlockerEnabled() {
		add_to_display.popup = 'true';
	}

	var getActiveXEnabled = function getActiveXEnabled() {
		add_to_display.activeX = 'true';
	}

	var getBrowser = function getBrowser() {
		add_to_display.browser = 'true';
	}


	/*
		This function creates a standard structure to allow manipulation of divs through CSS with the values
	*/
	var create_div_row = function(heading, message, image) {
		//alert(heading);
		if(heading != null && message != null) {
			var section_to_add = "<div class='compatibility_row'><div class='compatibility_heading'>";

			section_to_add += heading + "</div><div class='compatibility_value'>" + 
				message + "</div>";
			if(image != null && image != '') {
				section_to_add += "<div class='compatibility_image'>" + "<img src='" + image + "'/></div>";
			}
			section_to_add += "</div>";

			if(heading == self.popup_heading && message != 'temp' && popup_position != null) {
				configured_display[popup_position] = section_to_add;
				popup_position = null;
			} else {
				configured_display.push(section_to_add);
			}

			/*if(configured_display == null) {
				configured_display = section_to_add;
			} else {
				configured_display += section_to_add;
			}*/
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

		if(popup_position != null && add_to_display.popup == 'temp') {
			heading = self.popup_heading;
			message = 'temp';
			add_to_display.popup = null;
		}

		if(add_to_display.popup != '' && add_to_display.popup != null && add_to_display.popup != 'temp') {
			var popup = 0;
	        var myPopup = window.open("./html/popup_test.html", "_blank", "directories=no,height=150,width=150,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no,left=50");
	        heading = self.popup_heading;
	        if (!myPopup) { 
	            message = "Enabled";
	            image = self.fail_image;
	            //alert("Your browser currently has a popup blocker enabled, please disable the blocker or allow popups for this website. ERROR #1");
	        } else {
	            myPopup.onload = function() {
	                setTimeout(function() {
	                    if (myPopup.screenX === 0) {
	                        message = "Enabled";
	            			image = self.fail_image;
	                        //alert("Your browser currently has a popup blocker enabled, please disable the blocker or allow popups for this website. ERROR #2");
	                    } else {
	                        // close the test window if popups are allowed.
	                        this.focus();
	                        myPopup.opener = this;
	                        myPopup.close();
	                        popup = 1;
	                        message = "Disabled";
	            			image = self.pass_image;
	            			create_div_row(heading, message, image);
	            			update_page();
	                    }
	                }, 0);
	            }();
	        }

	        add_to_display.popup = null;
		}

		if(add_to_display.activeX != '' && add_to_display.activeX != null) {
			heading = self.activeX_heading;

			if(typeof(window.ActiveXObject)=="undefined"){
			      message = "Browser Not Supported";
			      image = self.not_supported_image;
			  } else {
			      message = "Enabled";
			      image = self.pass_image;
			  }

			add_to_display.activeX = null;
		}

		if(add_to_display.browser != '' && add_to_display.browser != null) {
			heading = self.browser_heading;

			function checkBrowser() {
			      var N= navigator.appName, ua= navigator.userAgent, tem;
			      var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
			      if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
			      M= M? [M[1] + ' ', M[2]]: [N, navigator.appVersion,'-?'];
			      //alert(M);
			      return M;
			}

			function checkBrowserName() {
			      var N= navigator.appName, ua= navigator.userAgent, tem;
			      var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
			      if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
			      M= M? [M[1]]: [N, navigator.appVersion,'-?'];
			      //alert(M);
			      return M;
			}

			message = checkBrowserName();

			var supported_browsers = self.supported_browsers.split(",");
			
			for(i = 0; i < supported_browsers.length; i++) {
				if(supported_browsers[i].indexOf(message) !== -1) {
					image = self.pass_image;
					break;
				} else {
					image = self.fail_image;
				}
			}

			add_to_display.browser = null;
		}

		create_div_row(heading, message, image);
	}

	var update_page = function() {
		var final_display = null;

		for(i = 0; i < configured_display.length; i++) {
			//alert(configured_display[i]);
			if(final_display == null) {
				final_display = configured_display[i];
			} else {
				final_display = final_display + configured_display[i];
			}
		}

		document.getElementById(self.div_id).innerHTML = final_display;
		updateCompatabilityDisplayLook();
	}
	
	return {
		init: init,
		update_page: update_page,
		updateCompatabilityDisplayLook: updateCompatabilityDisplayLook
	}
}());