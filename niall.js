// Set constants and variables
const Discord = require('discord.js');
const Niall = bot = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = require('./ch.js');
const Role = require('./role.js');
const Birthday = require('./bday.js');
const Darebee = require('./darebee.js');
var testmode;
Rems=[];
cronjobs=[];

// Announce functions
//testmode=true; // Comment this line out for normal operations
chat=function(say,channel) {
	if (say) {
		if (!channel) {
			channel=onConn;
			console.log("No channel sent for: "+say)
		}
		if (testmode) {
			channel=testConn;
		}
		return channel.send(say);
	};
}
richChat=function(say,color,channel) {
	if (say) {
		if (!color) {
			color='#000000';
		}
		if (!channel) {
			channel=onConn;
			console.log("No channel sent for (rich): "+say)
		}
		if (testmode) {
			channel=testConn;
		}
		var embed = new Discord.RichEmbed()
			.setColor(color)
			.setDescription(say);
		return channel.send({ embed });
	};
}
test=function(say,channel) {
	if (!channel) {
		channel=onconn;
		console.log("No channel sent for:")
	}
	console.log(say);
}

// Replace user reference with "friend" (proper case) when no user referenced
Mbr=function(mem,leadcap) {
	return leadcap?mem||"Friend":mem||"friend";
}

// Initial setup
Niall.on('ready', () => {
	// Define Ch and Role objects
	Ch.set("inn","664197181846061080");
	Ch.set("guide","664199483025915904");
	Ch.set("quest","665311310581596160");
	Ch.set("test","693847888396288090");
	Ch.set("herald","664889622987538435");
	Role.set("leader","666316148589068328");
    Role.set("workout","674677574898548766");
    
    // Define frequently used references
    onConn = Ch.get("inn");
	testConn = Ch.get("test");
	heraldConn = Ch.get("herald");
	GuideRef = Ch.ref("guide");
	QuestRef = Ch.ref("quest");
	WorkoutRef = Role.ref("workout");
	LeaderRef = Role.ref("leader");
    
    // Wakeup message
    var say=[
		"Ahem.",
		"*Adjusts himself in the corner he's hiding in.*",
		"*Sits up.*",
		"*Coughs quietly.*",
		"*Hums under his breath.*",
		"*Shakes his head to wake himself up.*",
		"*Blinks his eyes several times.*"
	];
	chat(say[Math.floor(Math.random()*say.length)],onConn);
});

// Reply to messages
Niall.on('message', msg => {
	// Respond to any capitalization
    var input=msg.content.toLowerCase();
	
	// Triggered responses
	if (input.match(/^!help/)||msg.content.match(/^help.*niall.*/)) {
		chat(Mbr(msg.member,1)+", here's what I can do!\n\n**!tip** - I'll give you a random tip.\n**!bday** - Tell me your birthday so we can celebrate together.\n**!quest** - Use this when you send the invite for a new quest and I'll let everyone know when there's an hour left until the quest is set to start. (Not working yet.)\n**!help** - I'll display this message.",msg.channel);
	}
	if (input.match(/^!bday/)) {
		Birthday.Add(msg,chat);
	}

	// Admin only responses
	if(msg.member.roles.find("name", "Party Leader")) {
		if (input.match(/^!dbprogram/)) {
			Darebee.Add(msg,chat);
		}
		
		if (input.match(/^!level/)) {
			Darebee.Level(msg,chat,WorkoutRef);
		}
		
		if (input.match(/^!program ?([1-5]*)/)) {
			level=input.match(/^!program ?([1-5]*)/);
			if (level) {
				level=level[1];
			}
			Darebee.Program(msg,chat,level,heraldConn,WorkoutRef);
		}
	}
	
	// Modularized responses
	chat(require('./social.js')(input),msg.channel); // Social responses
	chat(require('./quest.js')(input),msg.channel); // Quest announcements
	chat(Birthday.Check(msg.author.id),msg.channel); // Birthday greetings
	richChat(require('./tips.js')(input),'#ffffcc',msg.channel); // Tips
});

// New member greeting
Niall.on('guildMemberAdd', member => {
    chat("Welcome to the party, "+Mbr(member,0)+"! If you're new to Habitica, please check out "+GuideRef+". Until the "+LeaderRef+" has verified you're in the party, you'll not have permission to talk... sorry about that, but this is supposed to be a private area for the party.\n\nOnce you've been vetted, to see what I can help you with, type `!help`.");
});

Niall.login(auth.token);
