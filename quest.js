const temp = require('./temp.js');
var quest = temp.get("quest");
var time;

// Announce new quest and add to temp file.
Add=function(msg,say,role) {
	// On activation:
	say(role+", new quest just posted! Another reminder will be sent to all Questers in 23 hours.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",msg.channel);
	// Calculate now plus 23 hours.  Record to a temp file.
	var date=new Date();
	date.setHours(date.getHours() + 23);
	temp.set("quest",Number(date));
	quest=temp.get("quest");
	Schedule(say,msg.channel,role);
}

// If temp file exists, read it and return schedule info.
Schedule=function(say,chan,role) {
	if (quest) {
		var now=new Date();
		var when=new Date(Number(quest));
		time=setTimeout(()=>{Announce(say,chan,role)},when-now);
	}
}

Announce=function(say,chan,role) {
	say(role+", new quest will start in an hour. Last chance to accept.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
	temp.del("quest");
}

module.exports.Add=Add;
module.exports.Schedule=Schedule;
module.exports.Announce=Announce;
