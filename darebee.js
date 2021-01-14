// Grab loc and ref from Niall.
Setup=function(bot,DBConn,DBRef) {
	client=bot;
	loc=DBConn;
	ref=DBRef;
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

Import=function() {
	var sch; // Array (0 indexed)
	var temp; // String for file write
	var progs=[]; // Keyed array
	
	// Read the file
	contents=parseCSV(file);
	
	// Remove trailing hard return(s)
	while (contents.slice(-1)=="\n") {
		contents=contents.slice(0,-1);
	}
	
	// Creating array of strings by lines
	sch=contents;
	
	// Split strings into sub-arrays and dupe check
	for (var a in sch) {
		if (sch[a][0] != "" ) {
			// Move ID to key to dupe check
			progs[sch[a][0]]=sch[a].slice(1);
		}
	}
	
	// Pass clean keyed data to Schedule
	data=progs;
	
	// Write the clean file
	sch=[];
	for (var a in progs) {
		sch.push('"'+a+'","'+progs[a].join('","')+'"');
	}
	temp=sch.join("\n")+"\n";
	fs.writeFileSync(file, temp);
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

getNext=function(data) {
	var test=temp.get("next");
	for (a in data) {
		if (test==data[a][0]) {
			program=data[a];
		}
	}
	if (program) return program;
	else return false;
}

// Take date add two days, return date and formatted String.
dateForm=function(date,noTime) {
    if (!date) {
		date=new Date()
	}
	else {
        date=new Date(date);
    }
	return(date.toISOString().slice(0,10)+(noTime?"":" at "+date.toISOString().slice(11,16)+" eastern"));
}

// Look at message passed and make array of reacts and counts
countReacts=async function(ID) {
	var reacts={};
	var chans=["693847888396288090","695401715616186429"];
	for (var c = 0; c < chans.length; c++) {
		var chan=client.channels.cache.get(chans[c]);
		try {
			await chan.messages.fetch(ID)
			.then(msg=>{
				msg.reactions.cache.forEach((k,v)=>{reacts[k._emoji.name]=k._emoji.reaction.count});
			})
			.catch(e=>{})
		}
		catch(e) {return};
	}
	return reacts;
}

// Add Darebee programs BROKEN
Add=function(msg,say) {
	// Declare variables
	var ID=msg.author.id;
	var input=msg.content;
	var info=input.match(/^!dbprogram \"(.+)\" \"([1-5])\" \"(.+)\" \"(.+)\" \"(.*)\" \"([1-5]{2})?\"/);
	
	if (info && info.length==7) {
		var name=info[1];
		var level=info[2];
		var URL=info[3];
		var emoji=info[4];
		var notes=info[5];
		var days=info[6]
		
		// Confirm correct information
		say("Just to confirm, I have a new level "+level+" program called "+name+". The URL for this program is <https://darebee.com/programs/"+URL+".html> and the emoji is "+emoji+".",msg.channel);
		
		// Record to csv file
		fs.appendFileSync(file, '"'+emoji+'","'+name+'","'+level+'","'+URL+'","'+notes+'","'+days+'"\n');
		Import();
		say("I've added that program to my workout book./n/nActually, that sounds like too much work.",msg.channel);
	}
	else {
		say('I need the new program in this format:\n\n**!DBProgram** **"program name"** (plain text) **"level"** (1-5, integers only) **"URL"** (just the page name without the .html extension) **"emoji"** (must be unicode) **"any notes"** (use "" if no notes) **"days"** (how long the program lasts, for default of 30 use "").',msg.channel);
		// Respond to function call and ask for data
	}
}

// Daily workout functions
Daily=function(say) {
	toSay="Workout time.\n\n"
	
	data=parseCSV(file);
	current=getCurrent(data); // Current program.
	currDate=new Date(current[current.length-1].split(/\D+/)); // Date that the current program started.
	currPart=current[5]||30; // Number of parts in the current program (defalts to 30).
	start=new Date(currDate);start.setDate(start.getDate()+(currPart+1)); // Date that the new program is set to start.
	temp.del("daily");
	temp.set("daily",dateForm(new Date(),true));
	if (current!="") {
		var part=Math.ceil((new Date()-currDate) / (1000 * 60 * 60 * 24)); // Today's part of the current program.
		
		// Case = days until program ends
		if (part<=currPart) {
			toSay+=ref+", beginning our workout! Today's workout: <https://darebee.com/programs/"+current[3]+".html?start="+part+"> (Use `!workout` to toggle pings like this on/off. Without this role you won't be allowed to talk in this channel.)";
			switch(currPart-part) {
				case 10: 
					Level(say);
					break;
				case 8: 
					Program(say);
					break;
				case 6: 
					Count(say);
					break;
				case 4:
					Count(say);
					break;
				case 0: 
					next=getNext(data);
					tomm=new Date()
					tomm.setDate(tomm.getDate() + 1);
					
					toSay+="\n\nWe have finished **"+current[1]+"**!"+(next!=""?" Join us tomorrow as we start our next program, **"+next[1]+(next[4]!=""?"** ("+next[4]+")":"**")+"!":"");
					// Add new date into darbee.csv
					next.pop();
					next.push(dateForm(tomm,true));
					fs.appendFileSync(file,csv.fromArray([next]));
					Import();
					temp.del("next");
					break;
			}
		}
	}
	else toSay+="That's odd, I don't see a workout for today.  I guess you can do whatever workout you want."
	say(toSay,loc);
	
	temp.del("workout");
	workout = temp.get("workout");
}

// State time when votes will be tallied.
Tally=function() {
	var tally="in 48 hours";
	var date=new Date();
	date.setDate(date.getDate() + 2);
	
	if (date) {
		tally="on "+dateForm(date);
	}
	return tally;
}

// Vote for level of next Darebee program
Level=function(say) {
	// Darebee Pick Levels
	say(ref+", our current program is "+current[1]+" at level "+current[2]+". What level(s) would you like to be included in the vote for next Darebee program?  Vote for as many as you want, votes will be tallied "+Tally()+" or thereabouts.",loc).then(async (say) => {
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
    countReacts(fromTemp)
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
            say("**Repeat Current Program:**\n"+current[0]+"️ From level "+current[2]+", "+current[1]+": <https://darebee.com/programs/"+current[3]+".html>"+(current[4]!=""?" ("+current[4]+")":"")+".\n*If we repeat, we could all attempt to work to a higher level than we did previously.*\n",loc);
            emotes.push(current[0]);
        }

        for (var a=1;a<6;a++) {
            if (level.includes(a)) {
                toSay="**Or we can choose something from level "+a+":**";
                for (b in voted) {
                    if (voted[b][2] == a) {
                        toSay+="\n"+voted[b][0]+" "+voted[b][1]+": <https://darebee.com/programs/"+voted[b][3]+".html>"+(voted[b][4]!=""?" ("+voted[b][4]+")":"");
                        emotes.push(voted[b][0]);
                    }
                }
                say(toSay,loc);
            }
        }
        
        // Votes will be tallied on [date] at [time].
        say("**VOTE HERE**\nRespond to **this** message with the emoji of your preferred program. Vote for as many as you want, though Discord only allows 20 different reacts. Votes will be tallied "+Tally()+" or thereabouts. (If we EVER start a program and agree it's too challenging to keep up with, we can drop back and re-decide.)",loc)
        .then(async (say) => {
            temp.del("level");
            temp.set("program",say.id);
        })
    })
    .catch(console.error);
}

CountTies=function(say,votes) {
    var n=0;
	if (!votes) {
		say("I guess you didn't want another program now. Hmm.",loc);
		temp.del("tie");
		temp.del("program");
		return;
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
    DBAnnounce(say,program); // Announce winner and set new current
}

CountVotes=function(say,votes) {
    var n=0;
    if (votes.length==0) {
        say("I guess you didn't want another program now. Hmm.",loc);
        temp.del("ties");
        temp.del("program");
        return;
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
        Tie(say,program);
    }
    else {
		DBAnnounce(say,program); // Announce winner and set new current
    }
}

Count=function(say) {
	var votesID=temp.get("program");
	var tiesID=temp.get("tie");
	if (tiesID) countReacts(tiesID).then(votes=>{if (votes) CountTies(say,votes)});
	else if (votesID) countReacts(votesID).then(votes=>{if (votes) CountVotes(say,votes)});
}

// Vote among tied programs
Tie=function(say,program) {
	var ties=[];
	var emotes=[];
	
	for (a in program) {
		data.forEach((check)=>{if(check[0]==program[a]) ties.push(check);});
	}

	// Take the winning programs and restart vote among only them.
	toSay=ref+", we had a tie! Please vote from the programs listed below.\n\n";
	
	for (b in ties) {
		toSay+=ties[b][0]+" "+ties[b][1]+": <https://darebee.com/programs/"+ties[b][3]+".html>"+(ties[b][4]!=""?" ("+ties[b][4]+")":"")+"\n";
		emotes.push(ties[b][0]);
	}
	toSay+="\n**VOTE HERE**\nRespond to **this** message with the emoji of your preferred program. Votes will be tallied "+Tally()+" or thereabouts. A tie on this vote and I'll randomly chose one of those winners.";
	
	say(toSay,loc).then(async (say) => {
		temp.del("program");
		temp.set("tie",say.id);
	})
	.catch(console.error);
}

// Announce winner and set new current
DBAnnounce=function(say,program) {
	if (Array.isArray(program)) {
		program=program[Math.floor(Math.random()*program.length)];
	}
	[winner]=data.filter((check)=>{return check[0]==program;});
	
	toSay=ref+", the results are in!\n\nOur new program will be:\n"+winner[0]+" "+winner[1]+": <https://darebee.com/programs/"+winner[3]+".html>"+(winner[4]!=""?" ("+winner[4]+")":"")+"\n\n";
	
	toSay+="We'll be starting it on "+dateForm(start,true)+".";
	temp.set("next",winner[0],dateForm(start,true));
	
	say(toSay,loc).then(()=>{
		temp.del("tie");
	})
	.catch(console.error);
}

//Set contants and variables
var fs = require('fs');
const temp = require('./temp.js');
var csv=require('./csv.js')
var file="./darebee.csv";
var loc;
var ref;
var client;
var workout;
var data=parseCSV(file);
var current=getCurrent(data); // Current program.
var currDate=new Date(current[current.length-1].split(/\D+/)); // Date that the current program started.
var currPart=current[5]||30; // Number of parts in the current program (defalts to 30).
var start=new Date(currDate);start.setDate(start.getDate()+(currPart)); // Date that the new program is set to start.

module.exports.Setup=Setup;
module.exports.Daily=Daily;
module.exports.Add=Add;
module.exports.Program=Program;
module.exports.Count=Count;
module.exports.Level=Level;
