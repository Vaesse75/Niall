module.exports=function(input) {
	if (input.match(/^!quest/)) {
		// Pinged function sets a timer for 23 hours
		/* 
		 * // On activation:
		 *	"New quest just posted!"
		 *	// Calculate now plus 23 hours.  Record to a temp file.
		 *	// If temp file exists, read it and set timeout.
		 *	// Find difference between temp file's time and now, set to "time"
		 *	// Set timer and announce at proper time.
		 * 	setTimout(function() {say("@everyone New quest will start in an hour.  Last chance to accept.")},time);
		 *	// After announce, DELETE temp file.
		 */
		return "Sorry, I haven't learned how to do this yet.\n\n*Returns to his corner and sobs quietly.*";
		
		
		// "Use !Quester to toggle whether you want to be pinged by these reminders."
	}
};
