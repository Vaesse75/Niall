//Set contants and variables
var fs = require('fs');
const Usr = require('./user.js');
var cronjobs=[];
var file="/home/Plex/Bot/Niall/darebee.csv";
var CronJob = require('cron').CronJob;

emoji=function(msg,emojiName) {
	// Works for server emoji ONLY.  Can NOT find Discord generic emoji.
	return msg.guild.emojis.find(emoji => emoji.name === emojiName);
}

parseCSV=function(file,a) {
	var contents=fs.readFileSync(file, 'utf8');
	while (contents.slice(-1)=="\n") contents=contents.slice(0,-1);
	arr=contents.split("\n").map((line)=>{return line.slice(1,-1).split('","');});
	if (a) {
		aarr=[];
		arr.forEach((line)=>{var key=line.shift();aarr[key]=line.length==1?line[0]:line;});
		arr=aarr;
	}
	return arr;
}

// Add Darebee programs
module.exports.Add=function(msg,say) {
	// Declare variables
	var input=msg.content;
	var ID=msg.author.id;
	var info=input.match(/^!dbprogram \"(.+)\" \"([1-5])\" \"(.+)\" \"(.+)\" \"(.*)\" \"([1-5]{2})\"/);
	
	if (info && info.length==7) {
		var name=info[1];
		var level=info[2];
		var URL=info[3];
		var emojiName=info[4];
		var notes=info[5];
		var days=info[6]
		
		// Confirm correct information
		say("Just to confirm, I have a new level "+level+" program called "+name+". The URL for this program is <https://darebee.com/programs/"+URL+".html> and the emoji is "+emoji(msg,emojiName)+".",msg.channel);
		
		// Record to csv file
		//fs.appendFileSync(file, '"'+name+'","'+level+'","'+URL+'","'+emojiName+'","'+notes+'","'+days+'"\n');
		say("I've added that program to my workout book.",msg.channel);
		
		Import();
	}
	else {
		// Respond to function call and ask for data
		say('Reminder, you need to add the emoji for the program to Discord first. I need the new program in this format:\n\n**!DBProgram** **"program name"** (plain text) **"level"** (1-5, integers only) **"URL"** (just the page name without the .html extension) **"emoji name"** (do not include the `:`s, must be on this server) **"any notes"** (use "" if no notes) **"days"** (how long the program lasts).',msg.channel);
	}
}

// Vote for level of next Darebee program
module.exports.Level=function(msg,say,ref) {
	// Darebee Pick Levels
	say(ref+": What level(s) would you like to be included in the vote for next Darebee program?",msg.channel).then(async (say) => {
		var emojis=["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"];
		while (emojis.length>0) {
			await say.react(emojis.shift());
		}
	});
}

// Vote for next Darebee program
module.exports.Program=function(msg,say,level,channel,ref) {	
	var U=["☑️","❶","❷","❸","❹","❺"];
	var current=[];
	var voted=[];
	var toSay;
	var emotes=[];
	var data=parseCSV(file);
	var n=new Date();
	var c=new Date([1980,1,1]);
	
	console.log(n);
	// Select current (most recent in past) and voted records
	for (a in data) {
		var d=new Date(data[a][data[a].length-1].split(/\D+/).map(Number));
		if (d <= n && c < d) {
			current=data[a];
			c=new Date(current[current.length-1].split(/\D+/).map(Number));
		}
		else if (level.includes(data[a][1])) {
			voted.push(data[a]);
		}
	}
	
	// Message build
	//toSay=ref+": The **Co-op Workout** can continue if anyone is interested.  In a short while, we'll be done with the current Darebee program.  So now it's time to vote for our next program.\n";

	if (current) {
		toSay+="\n**Repeat Current Program:**\n☑️ From level "+current[1]+", "+current[0]+": <https://darebee.com/programs/"+current[2]+".html>"+(current[4]!=""?" ("+current[4]+")":"")+".\n*If we repeat, we could all attempt to work to a higher level than we did previously.*\n";
		emotes.push(U[0]);
	}

	for (var a=1;a<6;a++) {
		if (level.includes(a)) {
			toSay+="\n**Or we can choose something from level "+a+":**\n";
			for (b in voted) {
				if (voted[b][1] == a) {
					toSay+=U[a]+" "+voted[b][0]+": <https://darebee.com/programs/"+voted[b][2]+".html>"+(voted[b][4]!=""?" ("+voted[b][4]+")":"")+"\n";
					emotes.push(emoji(msg,voted[b][3]));
				}
			}
		}
	}
	
	toSay+="\nRespond below with the associated emoji to vote for your preference (I'll seed one of each).  You can vote for more than one option.  In case of a tie for winner, we'll revote with only the tied options and one vote per person.  (Note: If we EVER start a program and agree it's too challenging to keep up with, we can drop back and re-decide.)\n\n";
	
	toSay+="Meanwhile, Sophie has generously created a challenge for the party that mirrors the Take This challenge.  There will be a gem reward randomly assigned, so please participate!  <https://habitica.com/challenges/2d4ab911-4db9-488c-ba2d-96975b0d3e1b>\n\n";

	toSay+='Or you can join the "Co-Op Workout" *archieved* Take This challenge <https://habitica.com/challenges/ed1a0476-10e5-4a20-8b3c-6dcd1842d545>.  It will not have the Take This reward gear, but will give you the tasks and never expires.';
	
	say(toSay,channel).then(async (say) => {
		while (emotes.length>0) {
			await say.react(emotes.shift());
		}
	});
}

// Announce today's workout
Daily=function(program, part, callback) {
	// Data processing
	var data=fs.readFileSync(file,"utf8");
	
	while (data.slice(-1)=="\n") {
		data=data.slice(0,-1);
	}
	
	data=data.split("\n");
	for (a in data) {
		data[a]=data[a].slice(1,-1).split('","');
		if (data[a][data[a].length-1] != "") {
			current=data[a];
		}
	}
	callback(WorkoutRef+" Beginning our workout! Today's workout: <https://darebee.com/programs/"+program+".html?start="+part+"> (If you want to join us, now or in the future, let us know!)");
}

// Schedule the workout
Schedule=function() {
	cronjobs.push(new CronJob('0 0 13 * * *',Daily,null,true,"America/New_York"));
	cronjobs[cronjobs.length-1].start();
}

Schedule();
