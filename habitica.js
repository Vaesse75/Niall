const temp = require('./temp.js');
var quest = temp.get("quest");
var acceptQuest = temp.get("acceptQuest");

// If temp file exists, read it and return schedule info.
Schedule=function(say,chan,role) {
	temp.del("");
	
	if (quest) {
		var now=new Date();
		var when=new Date(Number(quest));
		
		setTimeout(()=>{AnnounceQuest(say,chan,role)},when-now>0?when-now:0);
	}
	if (acceptQuest) {
		var now=new Date();
		var when=new Date(Number(acceptQuest));
		
		setTimeout(()=>{AcceptQuest(say,chan,role)},when-now>0?when-now:0);
	}
}

// Announce new quest and add to temp file.
AddQuest=function(say,chan,role) {
	// On activation:
	API(`https://habitica.com/api/v3/groups/${habitica.groupId}/quests/accept`,(data)=>{
		console.log("\n\nNew Quest");
		console.log(data);
		global.questObj=JSON.parse(data);
	
	say(role+", new quest just posted! Go to <http://www.habitica.com> to accept. Another reminder will be sent to all Questers in 23 hours.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
	
	// Calculate now plus 23 hours.  Record to a temp file.
	var date=new Date();
	date.setHours(date.getHours() + 23);
	//date.setMinutes(date.getMinutes() + 2); // Short announce time for testing.
	temp.set("quest",Number(date));
	temp.set("questData",JSON.stringify(questObj));
	
	
	var QuestData=temp.get("questData");
	console.log("\n\nQuest Data");
	console.log(QuestData);
	
	quest=temp.get("quest");
	
	// Schedule the announce.
	Schedule(say,chan,role);
	});
}

AnnounceQuest=function(say,chan,role) {
	var QuestData=temp.get("questData");
		
	say(role+", new quest will start in an hour. Last chance to go to <http://www.habitica.com> to accept.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
	
	temp.del("quest");
	
	var acceptTime=new Date();
	acceptTime.setHours(acceptTime.getHours() + 1);
	temp.set("acceptQuest",Number(acceptTime));
}

AcceptQuest=function(say,chan,role) {
	API(`https://habitica.com/api/v3/groups/${habitica.groupId}/quests/force-start`,newQuest=>{
		say("New quest started.",chan);
		console.log("\n\nAccepted Quest");
		console.log(newQuest);
	});
	
	temp.del("acceptQuest");
	temp.del("questData");
}

API=function(command,callback,data) {
	//return callback('{"data":"true"}'); //Force success on request
	let sa=require('superagent');
	if (data) sa.post(command).send(data).set("x-api-user",habitica.user).set("x-api-key",habitica.key).set("x-client",habitica.client).set("accept","json").end((e,r)=>{if (r.status==200) callback(r.text);else if (e) console.error(e)});
	else sa.post(command).set("x-api-user",habitica.user).set("x-api-key",habitica.key).set("x-client",habitica.client).set("accept","json").end((e,r)=>{if (r.status==200) callback(r.text);else if (e) console.error(e)});
}

module.exports.AddQuest=AddQuest;
module.exports.Schedule=Schedule;
