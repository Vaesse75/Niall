//Set contants and variables
var fs = require('fs');
const temp = require('./temp.js');
var file="./darebee.csv";
var CronJob = require('cron').CronJob;
var cronjobs=[];
var loc;
var ref;
var client;

init=function(bot) {
	client=bot;
}

// Grab loc and ref from Niall.
Setup=function(DBConn,DBRef) {
	loc=DBConn;
	ref=DBRef;
}

// Return emoji from name.
// Works for server emoji ONLY.  Can NOT find Discord generic emoji.  Use UNICODE cut and paste for generics.
emoji=function(msg,emojiName) {
	return msg.guild.emojis.find(emoji => emoji.name === emojiName);
}

// Read CSV file, return array.
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

// Figure out what the current program is from workout.csv.
getCurrent=function(data) {
	var current=[];
	var n=new Date();
	var c=new Date([2000,1,1]);
	var date=false;

	// Select current (most recent in past) and voted records
	for (a in data) {
		var d=new Date(data[a][data[a].length-1].split(/\D+/).map(Number));
		if (d <= n && c < d) {
			current=data[a];
			c=new Date(current[current.length-1].split(/\D+/).map(Number));
			date=true;
		}
	}
	if (date) return current;
	else return false;
}

// Take date add two days, return date and formatted String.
dateForm=function(date,noTime) {
	if (!date) {
		date=new Date()
	}
	
	form=date.getFullYear().toString().padStart(4,'0')+"-"+(date.getMonth()+1).toString().padStart(2,'0')+"-"+date.getDate().toString().padStart(2,'0')+noTime?"":" at "+date.getHours().toString().padStart(2,'0')+":"+date.getMinutes().toString().padStart(2,'0');
	
	return(form);
}

// Look at message passed and make array of reacts and counts
countReacts=function(msg) {
	var reacts=[];
	
	for (a of msg.reactions.keys()) {
		reacts[a]=msg.reactions.get(a).count;
	}
	return reacts;
}

// Add Darebee programs
Add=function(msg,say) {
	// Declare variables
	var ID=msg.author.id;
	var input=msg.content;
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
	}
	else {
		// Respond to function call and ask for data
		say('Reminder, you need to add the emoji for the program to Discord first. I need the new program in this format:\n\n**!DBProgram** **"program name"** (plain text) **"level"** (1-5, integers only) **"URL"** (just the page name without the .html extension) **"emoji name"** (do not include the `:`s, must be on this server) **"any notes"** (use "" if no notes) **"days"** (how long the program lasts).',msg.channel);
	}
}

// Manage the schedule
Schedule=function(say) {
	// Daily workout announce
	cronjobs.push(new CronJob('0 5 13 * * *',()=>{Daily(say)},null,true,"America/New_York"));
	cronjobs[cronjobs.length-1].start();
}

// Daily workout functions
Daily=function(say) {
	var data=parseCSV(file);
	var current=getCurrent(data);
	var winner;
	
	if (current) {
		var currDate=new Date(current[current.length-1].split(/\D+/));
		var part=Math.ceil((new Date()-currDate) / (1000 * 60 * 60 * 24));
		var currPart=30;
		
		if (current[5]) {
			currPart=current[5];
		}
		var start=new Date().setDate(currDate.getDate()+currPart+1);
		if (part<=currPart) {
			toSay=ref+", beginning our workout! Today's workout: <https://darebee.com/programs/"+current[2]+".html?start="+part+"> (If you want to join us, now or in the future, let us know!)";
			switch(part-currPart) {
				case 10: 
					Level(say);
					break;
				case 8: 
					Program(say);
					break;
				case 6: 
					var votes=countReacts(temp.get("program"));
					// Read Program votes, if tie on Program
					var n=0;
					if (!votes) {
						say("I guess you didn't want another program now. Hmm.");
						break;
					}
					for (a in votes) {
						if (votes[a]>n) {
							n=votes[a];
						}
					}
					var program=[];
					for (a in votes) {
						if (votes[a]==n) {program.push(a);}
					}
					if (program.length>1) {
						Tie(program,say);
					}
					else Announce(program,start,say); // Announce winner and set new current
					break;
				case 4:
					if (program=temp.get("tie")) {
						// Count Tie
						var votes=countReacts(temp.get("tie"));
						for (a in votes) {
							if (votes[a]>n) {
								n=votes[a];
							}
						}
						var program=[];
						for (a in votes) {
							if (votes[a]==n) {program.push(a);}
						}
						Announce(program,say); // Announce winner and set new current
					}
					break;
				case 0: 
					// Ideally, add info about new program to message
					toSay+="\n\nWe have finished "+current[0]+"! We'll be starting our new program tomorrow!"
					break;
			}
			say(toSay,loc);
		}
	}
}

// Vote for level of next Darebee program
Level=function(say) {
	var data=parseCSV(file);
	current=getCurrent(data);
	var tally="in 48 hours";
	var date=new Date();
	date.setDate(date.getDate() + 2);
	
	tally="on "+dateForm(date);
	// Darebee Pick Levels
	say(ref+", our current program is "+current[0]+" at level "+current[1]+". What level(s) would you like to be included in the vote for next Darebee program?  Vote for as many as you want, votes will be tallied "+tally+".",loc).then(async (say) => {
		var emojis=["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"];
		while (emojis.length>0) {
			try {
				await say.react(emojis.shift());
			}
			catch(e) {
				console.error(e);
			}
		}
		temp.set("level",say.id);
	})
	.catch(console.error);
}

// Vote for next Darebee program
Program=function(say) {	
	var current=[];
	var voted=[];
	var toSay;
	var emotes=[];
	var data=parseCSV(file);
	var current=getCurrent(data);
	var votes;
	
	fromTemp=temp.get("level");
	client.channels.get(loc).fetchMessage(fromTemp)
	.then(countReacts)
	.then((votes)=>{
		var n=0;
		
		for (a in votes) {
			if (votes[a]>n) {
				n=votes[a];
			}
		}
		var level="";
		for (a in votes) {
			if (votes[a]==n) {
				level+=a;
			}
		}
		return level;
	})
	.then((level)=> {
		for (a in data) {
			if (data[a] != current && level.includes(data[a][1])) {
				voted.push(data[a]);
			}
		}

		// Message build
		say(ref+", the **Co-op Workout** can continue if anyone is interested.  In a short while, we'll be done with the current Darebee program.  So now it's time to vote for our next program.\n",loc);

		if (current) {
			say("**Repeat Current Program:**\n☑️ From level "+current[1]+", "+current[0]+": <https://darebee.com/programs/"+current[2]+".html>"+(current[4]!=""?" ("+current[4]+")":"")+".\n*If we repeat, we could all attempt to work to a higher level than we did previously.*\n",loc);
			emotes.push("☑️");
		}

		for (var a=1;a<6;a++) {
			if (level.includes(a)) {
				toSay="**Or we can choose something from level "+a+":**";
				for (b in voted) {
					if (voted[b][1] == a) {
						toSay+="\n"+voted[b][3]+" "+voted[b][0]+": <https://darebee.com/programs/"+voted[b][2]+".html>"+(voted[b][4]!=""?" ("+voted[b][4]+")":"");
						emotes.push(voted[b][3]);
					}
				}
				say(toSay,loc);
			}
		}
		
		// Votes will be tallied on [date] at [time].
		say("**VOTE HERE**\nRespond to **this** message with the emoji of your preferred program. Vote for as many as you want, though Discord only allows 20 different reacts. Votes will be tallied in 48 hours. (Note: If we EVER start a program and agree it's too challenging to keep up with, we can drop back and re-decide.)",loc)
		.then(async (say) => {
			temp.del("level");
			temp.set("program",say.id);
		})
	})
	.catch(console.error);
}

// Vote among tied programs
Tie=function(program,say) {
	for (a in program) {
		ties=data.filter((check)=>{check[3]==program[a]});
	}

	// Take the winning programs and restart vote among only them.
	toSay=ref+", we had a tie! Please vote from the programs listed below.\n\n";
	
	for (b in ties) {
		toSay+=ties[b][3]+" "+ties[b][0]+": <https://darebee.com/programs/"+ties[b][2]+".html>"+(ties[b][4]!=""?" ("+ties[b][4]+")":"")+"\n";
	}
	toSay+="\n**VOTE HERE**\nRespond to **this** message with the emoji of your preferred program. Votes will be tallied in 48 hours. A tie on this vote and I'll randomly chose one of those winners.";
	
	say(toSay,loc).then(async (say) => {
		temp.del("program");
		temp.set("tie",say.id);
	})
	.catch(console.error);
}

// Announce winner and set new current
Announce=function(program,start,say) {
	if (program.length>1) {
		program=program[Math.floor(Math.random()*say.length)];
	}
	
	[winner]=data.filter((check)=>{check[3]==program});
	
	toSay=ref+", our new program is:\n"+winner[3]+" "+winner[0]+": <https://darebee.com/programs/"+winner[2]+".html>"+(winner[4]!=""?" ("+winner[4]+")":"")+"\n\n";
	
	toSay+="We'll be starting it on "+dateForm(start,true)+".";
	
	for (a of data) {
		if (data[a]==winner) {
			data[a][data[a].length-1]=dateForm(start,true);
		}
	}
	
	arr=[];
	for (var a in data) {
		arr.push(`"`+data[a].join('","')+'"');
	}
	temp=arr.join("\n")+"\n";
	
	fs.writeFileSync(file, temp);
	
	say(toSay,loc).then(async (say) => {
		temp.del("tie");
	})
	.catch(console.error);
}

module.exports.init=init;
module.exports.Setup=Setup;
module.exports.Daily=Daily;
module.exports.Add=Add;
module.exports.Program=Program;
module.exports.Schedule=Schedule;
module.exports.Level=Level;
