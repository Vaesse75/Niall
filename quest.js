const temp = require('./temp.js');
var quest = temp.get("quest");

// Announce new quest and add to temp file.
Add=function(msg,say) {
	// On activation:
	say("New quest just posted!  Reminder will be sent to all Questers in 23 hours.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",msg.channel);
	// Calculate now plus 23 hours.  Record to a temp file.
	var date=new Date();
	date.setHours(date.getHours() + 23);
	temp.set("quest",Number(date));
	quest=temp.get("quest");
}

// If temp file exists, read it and return schedule info.
Schedule=function(doer,say,chan,role) {
	if (quest) {
		var when=new Date(Number(quest));
		// Attempt to spell out in "chron syntax"
		//when=when.getSeconds()+" "+when.getMinutes()+" "+when.getHours()+" "+when.getDate()+" "+when.getMonth()+" "+when.getDay();
		doer(when,Announce,[say,chan,role]);
	}
}

Announce=function(say,chan,role) {
	//role+
	say(", new quest will start in an hour.  Last chance to accept.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
	temp.del("quest");
}

module.exports.Add=Add;
module.exports.Schedule=Schedule;
module.exports.Announce=Announce;
