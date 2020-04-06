// Set constants and variables
const Discord = require('discord.js');
const Niall = bot = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = require('./ch.js');
const Role = require('./role.js');
const Birthday = require('./bday.js');
const DB = require('./darebee.js');
const Quest = require('./quest.js');
var training;
Rems=[];

// Announce functions
//training=true; // Comment this line out for normal operations
chat=function(say,chan) {
	if (say) {
		if (!chan) {
			chan=onConn;
			console.error("No channel sent for: "+say)
		}
		if (training) {
			chan=testConn;
		}
		return chan.send(say);
	};
}
reply=function(say,chan) {
	if (say) {
		if (!chan) {
			chan=onConn;
			console.error("No channel sent for (reply): "+say)
		}
		return chan.send(say);
	};
}
richChat=function(say,chan,color) {
	if (say) {
		if (!color) {
			color='#000000';
		}
		if (!chan) {
			chan=onConn;
			console.error("No channel sent for (rich): "+say)
		}
		if (training) {
			chan=testConn;
		}
		var embed = new Discord.RichEmbed()
			.setColor(color)
			.setDescription(say);
		return chan.send({ embed });
	};
}
test=function(say,chan) {
	if (!chan) {
		chan=onconn;
		console.error("No channel sent for:")
	}
	console.log(say);
}

// Replace user reference with "friend" (proper case) when no user referenced
Mbr=function(mem,leadcap) {
	return leadcap?mem||"Friend":mem||"friend";
}

// Initial setup
Niall.on('ready', () => {
	// Set Nickname depending on Training status
	Niall.guilds.get("664197181846061077").members.get("692526000994517102").setNickname(training?"Niall | In Training":"Niall | Village Crier");
	
	// Define Ch and Role objects
	Ch.set("inn","664197181846061080");
	Ch.set("guide","664199483025915904");
	Ch.set("quest","665311310581596160");
	Ch.set("test","693847888396288090");
	Ch.set("herald","664889622987538435");
	Ch.set("darebee","695401715616186429");
	Role.set("darebee","674677574898548766");
	Role.set("leader","666316148589068328");
	Role.set("quester","693612089134153829");
    
    // Define frequently used references
    onConn = Ch.get("inn");
	testConn = Ch.get("test");
	heraldConn = Ch.get("herald");
	DBConn = Ch.get("darebee");
	testRef = Ch.ref("test");
	GuideRef = Ch.ref("guide");
	QuestRef = Ch.ref("quest");
	LeaderRef = Role.ref("leader");
	DBRef = Role.ref("darebee");
	QuesterRef = Role.ref("quester");
    
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
	
	// Functions run on start
	DB.Setup(Niall,training?testConn:DBConn,DBRef);
	DB.Schedule(chat);
	Quest.Schedule(chat,onConn,QuesterRef);
});

// Reply to messages
Niall.on('message', msg => {
	// Respond to any capitalization
    var input=msg.content.toLowerCase();
	
	// Triggered responses
	if (input.match(/^!help/)||msg.content.match(/^help.*niall.*/)) {
		chat(Mbr(msg.member,1)+", here's what I can do!\n\n**!tip** - I'll give you a random tip.\n**time** - I'll tell you what time it is for me.  (Useful when comparing to other times I may give.)\n**!bday** - Tell me your birthday so we can celebrate together.\n**!quest** - Use this when you send the invite for a new quest and I'll let our Questers know when there's an hour left until the quest is set to start.\n\nROLES\n**!she** - Toggles on and off the She/Her pronoun role.\n**!he** - Toggles on and off the He/Him pronoun role.\n**!they** - Toggles on and off the They/Them pronoun role.\n**!quester** - Toggles on and off the Quester role (get tagged an hour before quests go live).\n**!workout** - Join and get tagged for daily workouts. (In the "+DBConn+".)\n**!spectator** - If you want to observe the "+testRef+".  (You may get extra wrong pings.)\n**!healer**/**!warrior**/**!mage**/**!rogue** - Switch to the chosen class. (You choose your class at level 10.)\n\n**!help** - I'll display this message.",msg.channel);
	}
	if (input.match(/^!time$/)||input.match(/^!date$/)) {
		var dt=new Date();
		var dateForm="The current date is: "+dt.getFullYear().toString().padStart(4,'0')+"-"+(dt.getMonth()+1).toString().padStart(2,'0')+"-"+dt.getDate().toString().padStart(2,'0')+" at "+dt.getHours().toString().padStart(2,'0')+":"+dt.getMinutes().toString().padStart(2,'0');
		chat(dateForm,msg.channel);
	}
	if (input.match(/^!bday/)) {
		Birthday.Add(msg,chat);
	}
	
	if (input.match(/^!quest$/)) {
		Quest.Add(msg,chat);
		Quest.Schedule(chat,onConn,QuesterRef);
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
	
	if (input.match(/^!spectator$/)||input.match(/^!bot$/)) {
		Role.Toggle(msg,"696409841538695278",chat);
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
	if (msg.member.roles.get("666316148589068328")) {
		if (input.match(/^!dbprogram/)) {
			DB.Add(msg,chat);
		}
		
		// Remove once automation complete
		if (input.match(/^!level$/)) {
			DB.Level(chat);
		}
		if (input.match(/^!program ?([1-5]*)/)) {
			level=input.match(/^!program ?([1-5]*)/);
			if (level) {
				level=level[1];
			}
			DB.Program(chat);
		}
	}
	
	// Modularized responses
	require('./social.js')(input,reply,msg.channel); // Social responses
	Birthday.Check(msg.author.id,chat,msg.channel); // Birthday greetings
	require('./tips.js')(input,richChat,msg.channel,'#ffffcc'); // Tips
});

// New member greeting
Niall.on('guildMemberAdd', member => {
    chat("Welcome to the party, "+Mbr(member,0)+"! If you're new to Habitica, please check out "+GuideRef+". Until the "+LeaderRef+" has verified you're in the party, you'll not have permission to talk... sorry about that, but this is supposed to be a private area for the party.\n\nOnce you've been vetted, to see what I can help you with, type `!help`.");
});

Niall.login(auth.token);
