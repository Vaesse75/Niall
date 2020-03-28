/*
    Future Plans:
		workout.js
			Sync
			Cron
			Cleanup
        quest.js functioning
        bday.js
			Sch to internal?
			Passes (Sch and msg) not working?
*/

// Set constants and variables
const Discord = require('discord.js');
const Niall = bot = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = require('./ch.js');
const Role = require('./role.js');
const Birthday = require('./bday.js');
Sch=Birthday.Import();
Rems=[];
cronjobs=[];
module.exports=bot;

//Announce functions
announce=function(say) {
	if (say) {
		onconn.send(say);
	};
}
test=function(say) {
	if (say) {
		console.log(say);
	};
}


// Replace User reference with "friend" when no user referenced
Mbr=function(mem,leadcap) {
    if (leadcap) {
        return mem||"Friend";
    }
    else return mem||"friend";
}

// Initial setup
Niall.on('ready', () => {
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
    var say=["Ahem.","*Adjusts himself in the corner he's hiding in.*","*Sits up.*","*Coughs quietly.*","*Hums under his breath.*"];
	onconn.send(say[Math.floor(Math.random()*say.length)]);
	
	// Function calls
	workout=require('./workout.js');
	workout.Schedule(workout.Daily,test);

	//Bday
});

// Reply to messages
Niall.on('message', msg => {
	// Respond to any capitalization
    var input=msg.content.toLowerCase();
	var chk=undefined;
	
    // Triggered responses
	if (input.match(/^!help/)||msg.content.match(/^help.*niall.*/)) {
		msg.channel.send(Mbr(msg.member,1)+", here's what I can do!\n\n**!tip** - I'll give you a random tip.\n**!bday** - Tell me your birthday so we can celebrate together.\n**!quest** - Use this when you send the invite for a new quest and I'll let everyone know when there's an hour left until the quest is set to start. (Not working yet.)\n**!help** - I'll display this message.");
	}
	if (input.match(/^!bday/)) {
		chk=undefined;
		chk=Birthday.Add(msg,announce);
		if (chk) {
			Sch=chk;
		}
	}
	// Having errors passing Sch as a whole and msg
	chk=undefined;
	chk=Birthday.Check(msg.author.id,Sch[msg.author.id],announce);
	if (chk) {
		Sch=chk;
	}
	
	// Modularized responses
	announce(require('./social.js')(input)); // Social responses
	announce(require('./quest.js')(input)); // Quest announcer
	say=require('./tips.js')(input); // Tips
	if (say) {
		var embed = new Discord.RichEmbed()
			.setColor('#ffffcc')
			.setDescription(say);
		msg.channel.send({ embed });
	};
});

// New member greeting
Niall.on('guildMemberAdd', member => {
    newconn.send("Welcome to the party, "+Mbr(member,0)+"! If you're new to Habitica, please check out "+GuideRef+".");
});

Niall.login(auth.token);
