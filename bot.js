/*
    Future Plans:
        Fix workout.js
        Implement birthday.js
        Ping for quest warning (in reply to messages)
*/

// Set constants and variables
const Discord = require('discord.js');
const Niall = bot = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = require('./ch.js');
const Role = require('./role.js');
const Bday = require('./bday.js');
Rems=[];
cronjobs=[];
workoutinfo=[];
module.exports=bot;

// Replace User reference with "friend" when no user referenced
Mbr=function(mem,leadcap) {
    if (leadcap) {
        return mem||"Friend";
    }
    else return mem||"friend";
}

// Initial setup
Niall.on('ready', () => {
	require('./workout.js');

    // Define Ch and Role objects
	Ch.set("inn","664197181846061080");
	Ch.set("guide","664199483025915904");
	Ch.set("quest","665311310581596160");
	Role.set("leader","666316148589068328");
    Role.set("workout","674677574898548766");
    
    // Define frequently used references
    onconn = Ch.get("inn");
    GuideRef = Ch.ref("guide");
	QuestRef = Ch.ref("quest");
    WorkoutRef = Role.ref("workout");
    
    // Wakeup message
    var say=["Ahem.","*Adjusts himself in the corner he's hiding in.*","*Sits up.*"];
	//onconn.send(say[Math.floor(Math.random()*say.length)]);
});

// Reply to messages
Niall.on('message', msg => {
	// Respond to any capitalization
    input=msg.content.toLowerCase();
	//module.exports={msg:msg,input:input};
	
    // Triggered responses
	if (input.match(/^!ping/)) {
    }
    if (input.match(/^!help/)||msg.content.match(/^help.*niall.*/)) {
		msg.channel.send(Mbr(msg.member,1)+", here's what I can do!\r\n\r\n!tip - I'll give you a random tip.\r\n!quest - Use this when you send invite for a new quest and I'll let everyone know when there's an hour left until the quest is set to start. (Not working yet.)\r\n!help - I'll display this message.");
	}

	// Modularized responses
	social=require('./social.js')(input); // Social responses
	if (social) {
		msg.channel.send(social);
	};
	tips=require('./tips.js')(input); // Tips
	if (tips) {
		var embed = new Discord.RichEmbed()
			.setDescription(tips);
		msg.channel.send({ embed });
	};
	quest=require('./quest.js')(input); // Quest
	if (quest) {
		msg.channel.send(social);
	};
});

// New member greeting
Niall.on('guildMemberAdd', member => {
    newconn.send("Welcome to the party, "+Mbr(member,0)+"! If you're new to Habitica, please check out "+GuideRef+".");
});

Niall.login(auth.token);
