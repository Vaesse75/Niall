Role.set("quester","693612089134153829");
var ref = Role.ref("quester");
var quest = temp.get("quest");
var acceptQuest = temp.get("acceptQuest");

onConn = Ch.get("inn");

// If temp file exists, read it and return schedule info.
module.exports = {
	name: 'quest',
	description: "Use this when you que a new quest and I'll let our Questers know when there's an hour left until the quest is set to start.",
	usage: `\`!quest\``,
	execute(msg, args) {
		// Calculate now plus 23 hours.  Record to a temp file.
		var date=new Date();
		date.setHours(date.getHours() + 23);
		//date.setMinutes(date.getMinutes() + 2); // Short announce time for testing.
		temp.set("quest",Number(date));
		
		quest=temp.get("quest");
		
		// Schedule the reminder announce.
		Schedule(msg.channel);
		
		// Accept the quest for me if I didn't trigger the command
		if (msg.author.id !== '341458616424857602') {
			API(`https://habitica.com/api/v3/groups/${habitica.groupId}/quests/accept`,(data)=>{
				console.log("Accepted quest for Vaesse.");
			});
		}
		
		chat(ref+", new quest just posted! Go to <http://www.habitica.com> to accept. Another reminder will be sent to all Questers <t:"+date+":R>.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",msg.channel);
	}
}
	
Schedule=function(chan) {
	temp.del("");
	
	quest = temp.get("quest");
	acceptQuest = temp.get("acceptQuest");
	
	if (acceptQuest) {
		var now=new Date();
		var when=new Date(Number(acceptQuest));
		
		setTimeout(()=>{AcceptQuest(chan)},when-now>0?when-now:0);
		temp.del("quest");
	}
	else if (quest) {
		var now=new Date();
		var when=new Date(Number(quest));
		
		setTimeout(()=>{AnnounceQuest(chan)},when-now>0?when-now:0);
	}
	
	quest = temp.get("quest");
	acceptQuest = temp.get("acceptQuest");
}

AnnounceQuest=function(chan) {
	var acceptTime=new Date();
	acceptTime.setHours(acceptTime.getHours() + 1);
	temp.set("acceptQuest",Number(acceptTime));
	
	quest = temp.get("quest");
	if (quest) {
		chat(ref+", new quest will start <t:"+acceptTime+":R>. Last chance to go to <http://www.habitica.com> to accept.\n\nUse **!Quester** to toggle whether you want to be pinged by these reminders.",chan);
		
		temp.del("quest");
		quest = temp.get("quest");
		
		// Schedule the announce.
		Schedule(chan);
	}
	acceptQuest = temp.get("acceptQuest");
}

AcceptQuest=function(chan) {
	acceptQuest = temp.get("acceptQuest");
	if (acceptQuest) {
		API(`https://habitica.com/api/v3/groups/${habitica.groupId}/quests/force-start`,newQuest=>{
		chat("New quest started!",chan);	
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

Schedule(onConn);
