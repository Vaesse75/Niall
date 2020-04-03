// Set constants and variables
const Discord = require('discord.js');
const Niall = bot = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = require('./ch.js');
const Role = require('./role.js');
const Birthday = require('./bday.js');
const DB = require('./darebee.js');
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
    
    // Define frequently used references
    onConn = Ch.get("inn");
	testConn = Ch.get("test");
	heraldConn = Ch.get("herald");
	GuideRef = Ch.ref("guide");
	QuestRef = Ch.ref("quest");
	LeaderRef = Role.ref("leader");
	Darebee = Ch.ref("darebee");
    
    // Wakeup message
    var say=[
		"Ahem.",
		"*Sits up.*",
		"*Coughs quietly.*",
		"*Hums under his breath.*",
		"*Blinks his eyes several times.*",
		"*Shakes his head to wake himself up.*",
		"*Adjusts himself in the corner he's hiding in.*"
	];
	chat(say[Math.floor(Math.random()*say.length)],onConn);
	DB.Schedule(chat);
});

// Reply to messages
Niall.on('message', msg => {
	// Respond to any capitalization
    var input=msg.content.toLowerCase();
	
	// Triggered responses
	if (input.match(/^!help/)||msg.content.match(/^help.*niall.*/)) {
		chat(Mbr(msg.member,1)+", here's what I can do!\n\n**!tip** - I'll give you a random tip.\n**!bday** - Tell me your birthday so we can celebrate together.\n**!quest** - Use this when you send the invite for a new quest and I'll let everyone know when there's an hour left until the quest is set to start. (Not working yet.)\n\nROLES\n**!she** - Toggles on and off the She/Her pronoun role.\n**!he** - Toggles on and off the He/Him pronoun role.\n**!they** - Toggles on and off the They/Them pronoun role.\n**!quester** - Toggles on and off the Quester role (get tagged an hour before quests go live).\n**!workout** - Join and get tagged for daily workouts. (In the "+Darebee+".)\n**!healer**/**!warrior**/**!mage**/**!rogue** - Switch to the chosen class.\n\n**!help** - I'll display this message.",msg.channel);
	}
	if (input.match(/^!bday/)) {
		Birthday.Add(msg,chat);
	}
	
	//Pronoun Roles
	if (input.match(/^!she$/)||input.match(/^!her$/)) {
		Role.Toggle(msg,"668111455475859488",chat);
	}
	if (input.match(/^!he$/)||input.match(/^!him$/)) {
		Role.Toggle(msg,"668111419262238750",chat);
	}

	if (input.match(/^!they$/)||input.match(/^!them$/)) {
		Role.Toggle(msg,"668111380913717272",chat);
	}
	
	//Other Roles
	if (input.match(/^!quester$/)) {
		Role.Toggle(msg,"693612089134153829",chat);
	}
	
	if (input.match(/^!workout$/)) {
		Role.Toggle(msg,"674677574898548766",chat);
	}
	
	//Classes Switch 
	if (input.match(/^!healer$/)) {
		Role.Class(msg,"healer",chat);
	}
	if (input.match(/^!warrior$/)) {
		Role.Class(msg,"warrior",chat);
	}
	if (input.match(/^!mage$/)) {
		Role.Class(msg,"mage",chat);
	}
	if (input.match(/^!rogue$/)) {
		Role.Class(msg,"rogue",chat);
	}
	
	// Admin only responses
	if (msg.member.roles.has("Party Leader")) {
		if (input.match(/^!dbprogram/)) {
			DB.Add(msg,chat);
		}
		
		if (input.match(/^!program ?([1-5]*)/)) {
			level=input.match(/^!program ?([1-5]*)/);
			if (level) {
				level=level[1];
			}
			DB.Program(level,chat);
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
