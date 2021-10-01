 // Set constants and variables
const {prefix,token,habitica} = require('/home/plex/bots/authNiall.json');
global.Discord = require('discord.js');
global.Niall = global.bot = global.client = new Discord.Client(Discord.Intents.ALL);
global.cron = require('cron');
global.fs = require('fs');
global.csv = require('./csv.js');
global.Ch = require('./ch.js');
global.Role = require('./role.js');
global.Type = require('./typing.js');
global.temp = require('./temp.js');
global.habitica=habitica;

global.Birthday = require('./bday.js'); // remove once properly factored
global.DB = require('./darebee.js'); // remove once properly factored

const findPlugins=function(client,command,plg) {
	let [prop,key]=plg;
	(plg.length>2?true:("execute" in command) && (key in command))?client[prop].set(command[key],command):Object.keys(command).forEach((c) => {findPlugins(client,command[c],plg);});
}

// folder/type, key
let plugins=[["commands","name"],["socials","trigger"],["core","name",0]];
plugins.forEach(plg=>{
	bot[plg[0]]=new Discord.Collection();
	let tmp=fs.readdirSync("./"+plg[0]).filter(file => file.endsWith(".js"));
	for (const file of tmp) findPlugins(bot,require(`./${plg[0]}/${file}`),plg);
});

var training;
var chatQueue=[];

// Announce functions
//training=true; // Comment this line out for normal operations

global.chat=async function(text,chan) {
	if (text) {
		if (!chan) {
			chan=onConn;
			console.error("No channel sent for: "+text)
		}
		if (training) {
			chan=testConn;
		}
		return Type(text,chan);
	}
}

global.richChat=function(text,chan,color) {
	if (text) {
		if (!color) {
			color='#000000';
		}
		if (!chan) {
			chan=onConn;
			console.error("No channel sent for (rich): "+text)
		}
		if (training) {
			chan=testConn;
		}
		var embed = new Discord.MessageEmbed()
			.setColor(color)
			.setDescription(text);
		return chan.send({ embed });
	};
}

// Replace user reference with "friend" (proper case) when no user referenced
global.Mbr=function(mem,leadcap) {
	return leadcap?`${mem}`||"Friend":`${mem}`||"friend";
}

runSocials=function(msg) {
	text=[];
	client.socials.forEach(social => {if (social.trigger(msg)) text.push(social.execute(msg));});
	if (text.length > 0) {
		if (Array.isArray(text)) {
			text=text.flat();
			i=Math.floor(Math.random()*text.length);
			if (typeof text[i] == "string") chat(text[i],msg.channel);
			else console.error(`Nothing to say:\nindex ${i} of:\n${text}`);
		}
		else if (typeof text == "string") chat(text,msg.channel);
	}
}

// Initial setup
Niall.on('ready', () => {
	// Set Nickname depending on Training status
	Niall.guilds.cache.get("664197181846061077").me.setNickname(training?"Niall | In Training":"Niall | Village Crier");
	
	// Define Ch and Role objects
	Ch.set("inn","664197181846061080");
	Ch.set("guide","664199483025915904");
	Ch.set("quest","665311310581596160");
	Ch.set("test","693847888396288090");
	Ch.set("herald","664889622987538435");
	Ch.set("darebee","695401715616186429");
	Ch.set("gem","759088721424285777");
	Ch.set("calendar","799331225046351883");
	Role.set("darebee","674677574898548766");
	Role.set("leader","666316148589068328");
	Role.set("quester","693612089134153829");
	Role.set("donor","759087823394439218");
	
    // Define frequently used references
    onConn = Ch.get("inn");
	testConn = Ch.get("test");
	DBConn = Ch.get("darebee");
	
	// Wakeup message
    var text=[
		"Ahem.",
		"*Sits up.*",
		"*Coughs quietly.*",
		"*Hums under his breath.*",
		"*Blinks his eyes several times.*",
		"*Shakes his head to wake himself up.*",
		"*Adjusts himself in the corner he's hiding in.*"
	];
	chat(text[Math.floor(Math.random()*text.length)],onConn);
	
	// Functions run on start
	DB.Setup(training?testConn:DBConn);
	
	//DB daily if not done today and between 13:00 and 23:59.
	
	//DB.Schedule=new cron.CronJob('00 10 00 * * *', () => DB.Daily()); // Place to play with wrong times while testing.
	DB.Schedule=new cron.CronJob('00 00 13 * * *', () => DB.Daily());
	DB.Schedule.start();
	
	// Birthday.Schedule=new cron.CronJob('00 00 12 * * *', () => Birthday.Daily(onConn));
	// Birthday.Schedule.start();
});

// Reply to messages
Niall.on('message', msg => {
	// Ignore messages from yourself
	if (bot.user.id!==msg.author.id) {
		// Respond to any capitalization
		var input=msg.content.toLowerCase();
		
		// Triggered responses
		if (input.match(/^!bday/)) {
			Birthday.Add(msg,chat);
		}
		
		if (input.match(/^!daily$/)) {
			DB.Daily();
		}
		
		// Birthday.Check(msg.author.id,chat,msg.channel); // Birthday greetings
			
		const args = msg.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		if (msg.content.startsWith(`${prefix}${commandName}`) && bot.commands.has(commandName)) {
			const command=bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if (command.args && !args.length) {
				let text = `You're missing details, ${msg.author}!`;
				if (command.usage) {
					text += `\nTry saying it this way: ${command.usage}`;
				}
				return chat(text,msg.channel);
			}
			else command.execute(msg, args);
		}
		
		// Plain text social responses
		else {
			runSocials(msg);
		}
	}
});

// New member greeting
Niall.on('guildMemberAdd', member => {
	GuideRef = Ch.ref("guide");
	LeaderRef = Role.ref("leader");
	
    chat("Welcome to the party, "+Mbr(member,0)+"! If you're new to Habitica, please check out the "+GuideRef+". Until the "+LeaderRef+" has verified you're in the party, you'll not have permission to talk... sorry about that, but this is supposed to be a private area for the party.\n\nOnce you've been vetted, to see what I can help you with, type `!help`.");
});

Niall.login(token);
