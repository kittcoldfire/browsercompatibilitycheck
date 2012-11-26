function popup() {
	setTimeout(function() {
        if (window.screenX === 0) {
            message = "Enabled";
			image = self.fail_image;
            //alert("Your browser currently has a popup blocker enabled, please disable the blocker or allow popups for this website. ERROR #2");
        } else {
            // close the test window if popups are allowed.
            this.focus();
            window.opener = this;
            window.close();
            popup = 1;
            message = "Enabled";
			image = self.pass_image;
        }
    }, 0);
}