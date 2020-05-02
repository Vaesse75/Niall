const temp = require('./temp.js');
var quest = temp.get("quest");
var time;

// Announce new quest and add to temp file.
Add=function(say,chan,role) {
	// On activation:
	say(role+", new quest just posted! Go to <http://www.habitica.com> to accept. Another reminder will be sent to all Questers in 23 hours.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
	
	// Calculate now plus 23 hours.  Record to a temp file.
	var date=new Date();
	date.setHours(date.getHours() + 23);
	//date.setMinutes(date.getMinutes() + 2); // Short announce time for testing.
	temp.set("quest",Number(date));
	quest=temp.get("quest");
	
	// Schedule the announce.
	Schedule(say,chan,role);
}

// If temp file exists, read it and return schedule info.
Schedule=function(say,chan,role) {
	if (quest) {
		var now=new Date();
		var when=new Date(Number(quest));
		
		time=setTimeout(()=>{Announce(say,chan,role)},when-now);
		time="";
	}
}

Announce=function(say,chan,role) {
	say(role+", new quest will start in an hour. Last chance to go to <http://www.habitica.com> to accept.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
	
	temp.del("quest");
	quest=temp.get("quest");
}

module.exports.Add=Add;
module.exports.Schedule=Schedule;
