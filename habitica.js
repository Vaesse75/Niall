const temp = require('./temp.js');
var quest = temp.get("quest");
var acceptQuest = temp.get("acceptQuest");

// If temp file exists, read it and return schedule info.
Schedule=function(say,chan,role) {
	temp.del("");
	
	quest = temp.get("quest");
	acceptQuest = temp.get("acceptQuest");
	
	if (acceptQuest) {
		var now=new Date();
		var when=new Date(Number(acceptQuest));
		
		setTimeout(()=>{AcceptQuest(say,chan,role)},when-now>0?when-now:0);
		temp.del("quest");
	}
	else if (quest) {
		var now=new Date();
		var when=new Date(Number(quest));
		
		setTimeout(()=>{AnnounceQuest(say,chan,role)},when-now>0?when-now:0);
	}
	
	quest = temp.get("quest");
	acceptQuest = temp.get("acceptQuest");
}

// Announce new quest and add to temp file.
AddQuest=function(say,message,role) {
	var chan=message.channel;
	
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
	
	// Accept the quest for me if I didn't trigger the command
	if (message.author.id !== '341458616424857602') {
		API(`https://habitica.com/api/v3/groups/${habitica.groupId}/quests/accept`,(data)=>{
			console.log("Accepted quest for Vaesse.");
		});
	}
}

AnnounceQuest=function(say,chan,role) {
	quest = temp.get("quest");
	if (quest) {
		say(role+", new quest will start in an hour. Last chance to go to <http://www.habitica.com> to accept.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
		
		temp.del("quest");
		quest = temp.get("quest");
		
		var acceptTime=new Date();
		acceptTime.setHours(acceptTime.getHours() + 1);
		temp.set("acceptQuest",Number(acceptTime));
				
		// Schedule the announce.
		Schedule(say,chan,role);
	}
	acceptQuest = temp.get("acceptQuest");
}

AcceptQuest=function(say,chan,role) {
	acceptQuest = temp.get("acceptQuest");
	if (acceptQuest) {
		API(`https://habitica.com/api/v3/groups/${habitica.groupId}/quests/force-start`,newQuest=>{
		say("New quest started!",chan);	
		});
		temp.del("acceptQuest");
		acceptQuest = temp.get("acceptQuest");
		temp.del("questData");
	}
}

API=function(command,callback,data) {
	//return callback('{"data":"true"}'); //Force success on request
	let sa=require('superagent');
	if (data) sa.post(command).send(data).set("x-api-user",habitica.user).set("x-api-key",habitica.key).set("x-client",habitica.client).set("accept","json").end((e,r)=>{
		if (r.status==200) callback(r.text);
		else if (e) {
			console.error(e);
			throw(new Error("API fail."));
		}
	});
	else sa.post(command).set("x-api-user",habitica.user).set("x-api-key",habitica.key).set("x-client",habitica.client).set("accept","json").end((e,r)=>{
		if (r.status==200) callback(r.text);
		else if (e) {
			console.error(e);
			throw(new Error("API fail."));
		}
	});
}

module.exports.AddQuest=AddQuest;
module.exports.Schedule=Schedule;
