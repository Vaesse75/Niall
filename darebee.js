//Set contants and variables
var fs = require('fs');
const Usr = require('./user.js');
var file="/home/Plex/Bot/Niall/darebee.csv";

emoji=function(msg,emojiName) {
	console.log(client.emojis);
	// Works for server emoji ONLY.  Can NOT find Discord generic emoji.
	return msg.guild.emojis.find(emoji => emoji.name === emojiName);
}

module.exports.Add=function(msg,say) {
	// Declare variables
	var input=msg.content;
	var ID=msg.author.id;
	var info=input.match(/^!dbprogram \"(.+)\" \"([1-5])\" \"(.+)\" \"(.+)\" \"(.*)\"/);
	
	if (info && info.length==6) {
		var name=info[1];
		var level=info[2];
		var URL=info[3];
		var emojiName=info[4];
		var notes=info[5];
		
		// Confirm correct information
		say("Just to confirm, I have a new level "+level+" program called "+name+". The URL for this program is <https://darebee.com/programs/"+URL+".html> and the emoji is "+emoji(msg,emojiName)+".",msg.channel);
		
		// Record to csv file
		//fs.appendFileSync(file, '"'+ID+'","'+name+'","'+day+'","'+month+'",""\n');
		say("I've added that program to my book.",msg.channel);
		
		Import();
	}
	else {
		// Respond to function call and ask for data
		say('Reminder, you need to add the emoji for the program to Discord first. I need the new program in this format:\n\n**!DBProgram** **"program name"** (plain text) **"level"** (1-5, integers only) **"URL"** (just the page name without the .html extension) **"emoji name"** (do not include the `:`s, must be on this server) **"any notes"** (use "" if no notes).',msg.channel);
	}
}

module.exports.Level=function(msg,say) {
	// Darebee Pick Levels
	say("@Co-op Workout: What level(s) would you like to be included in the vote for next Darebee program?",msg.channel).then(async (say) => {
		await say.react("1️⃣");
		await say.react("2️⃣");
		await say.react("3️⃣");
		await say.react("4️⃣");
		await say.react("5️⃣");
	});
}

module.exports.Program=function(msg,say,level) {	
	// Universal message

	say("@Co-op Workout: The **Co-op Workout** can continue if anyone is interested.  In a short while, we'll be done with the current Darebee program.  So now it's time to vote for our next program.\n\nRepeat Current Program:\n",msg.channel)
/*
	
	:ballot_box_with_check: "+ProgramName+" <https://darebee.com/programs/"+ProgramURL+".html>.  (If we repeat, we could all attempt to work to a higher level than we did previously.)

	<Chosen Level(s)>

	Respond below with the associated emoji to vote for your preference (I'll seed one of each).  You can vote for more than one option.  In case of a tie for winner, we'll revote with only the tied options and one vote per person.  (Note: If we EVER start a program and agree it's too challenging to keep up with, we can drop back and re-decide.)

	Meanwhile, Sophie has generously created a challenge for the party that mirrors the Take This challenge.  There will be a gem reward randomly assigned, so please participate!  <https://habitica.com/challenges/2d4ab911-4db9-488c-ba2d-96975b0d3e1b>

	Or you can join the "Co-Op Workout" *archieved* Take This challenge <https://habitica.com/challenges/ed1a0476-10e5-4a20-8b3c-6dcd1842d545>.  It will not have the Take This reward gear, but will give you the tasks and never expires."

level1=❶
level2=❷
level3=❸
level4=❹
level5=❺
*/
}
