// Grab loc and ref from Niall.
Setup=function(DBConn) {
	loc=DBConn;
	ref=Role.ref("darebee");
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
	var t; // String for file write
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
	t=sch.join("\n")+"\n";
	fs.writeFileSync(file, t);
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
	var program;
	for (a in data) {
		if (test[0]==data[a][0]) {
			program=data[a];
		}
	}
	console.log(program);
	if (program) return program;
	else return false;
}

nextProg=function(loc) {
	prog=getNext(data);
	if (prog) {
		text=("The next program we have selected appears to be:");
		text+=("\n"+prog[0]+" **"+prog[1]+"**");
		text+=(prog[4]!=""?" ("+prog[4]+")":"");
		text+=(":\n<https://darebee.com/programs/"+prog[3]+".html>");
	}
	if (!prog) {
		text=("I do not see a planned program to do next.");
	}
	chat(text,loc);
}

currProg=function(loc) {
	prog=current;
	if (prog) {
		text=("The program we're currently working on appears to be:");
		text+=("\n"+prog[0]+" **"+prog[1]+"**");
		text+=(prog[4]!=""?" ("+prog[4]+")":"");
		text+=(":\n<https://darebee.com/programs/"+prog[3]+".html>");
	}
	if (!prog) {
		text=("I do not see a current program.");
	}
	chat(text,loc);
}

// Take date, return in approx ISO format.
dateForm=function(date,noTime) {
    if (!date) {
		date=new Date()
	}
	else {
        date=new Date(date);
    }
	return(date.toISOString().slice(0,10)+(noTime?"":" at "+date.toISOString().slice(11,16)));
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
				msg.reactions.cache.forEach((k)=>{
					k.fetch()
					.then((r)=>{
						reacts[r._emoji.name]=r.count
					})
				});
			})
			.catch(e=>{})
		}
		catch(e) {return};
	}
	return reacts;
}

// Add Darebee programs BROKEN
Add=function(msg) {
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
		chat("Just to confirm, I have a new level "+level+" program called "+name+". The URL for this program is <https://darebee.com/programs/"+URL+".html> and the emoji is "+emoji+".",msg.channel);
		
		// Record to csv file
		fs.appendFileSync(file, '"'+emoji+'","'+name+'","'+level+'","'+URL+'","'+notes+'","'+days+'"\n');
		Import();
		chat("I've added that program to my workout book./n/nActually, that sounds like too much work.",msg.channel);
	}
	else {
		chat('I need the new program in this format:\n\n**!DBProgram** **"program name"** (plain text) **"level"** (1-5, integers only) **"URL"** (just the page name without the .html extension) **"emoji"** (must be unicode) **"any notes"** (use "" if no notes) **"days"** (how long the program lasts, for default of 30 use "").',msg.channel);
		// Respond to function call and ask for data
	}
}

// Daily workout functions
Daily=function() {
	text="Workout time.\n\n"
	
	temp.del("");
	
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
			text+=ref+", beginning our workout! Today's workout: <https://darebee.com/programs/"+current[3]+".html?start="+part+"> (Use `!workout` to toggle pings like this on/off. Without this role you won't be allowed to talk in this channel.)";
			switch(currPart-part) {
				case 10: 
					Level();
					break;
				case 8: 
					Program();
					break;
				case 6: 
					Count();
					break;
				case 4:
					Count();
					break;
				case 0: 
					next=getNext(data);
					tomm=new Date()
					tomm.setDate(tomm.getDate() + 1);
					
					text+="\n\nWe have finished **"+current[1]+"**!"+(next!=""?" Join us tomorrow as we start our next program, **"+next[1]+(next[4]!=""?"** ("+next[4]+")":"**")+"!":"");
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
	else text+="That's odd, I don't see a workout for today.  I guess you can do whatever workout you want."
	chat(text,loc);
	
	temp.del("workout");
	workout = temp.get("workout");
}

// Vote for level of next Darebee program
Level=function() {
	// Darebee Pick Levels
	var date=new Date();
	date.setDate(date.getDate() + 2);
	chat(ref+", our current program is "+current[1]+" at level "+current[2]+". What level(s) would you like to be included in the vote for next Darebee program?  Vote for as many as you want, votes will be tallied <t:"+date+":R> on <t:"+date+":F> or thereabouts.",loc).then(async (msg) => {
		var emojis=["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"];
		while (emojis.length>0) {
			try {
				await msg.react(emojis.shift());
			}
			catch(e) {
				//console.error(e);
			}
		}
		temp.set("level",msg.id);
	})
	.catch(console.error);
}

// Vote for next Darebee program
Program=function() {
	var current=[];
	var voted=[];
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
            if (data[a] != current && level.includes(data[a][2])) {
                voted.push(data[a]);
            }
        }

        // Message build
        chat(ref+", the **Co-op Workout** can continue if anyone is interested.  In a short while, we'll be done with the current Darebee program.  So now it's time to vote for our next program.\n",loc);

        if (current) {
            chat("**Repeat Current Program:**\n"+current[0]+"️ From level "+current[2]+", "+current[1]+": <https://darebee.com/programs/"+current[3]+".html>"+(current[4]!=""?" ("+current[4]+")":"")+".\n*If we repeat, we could all attempt to work to a higher level than we did previously.*\n",loc);
            emotes.push(current[0]);
        }

        for (var a=1;a<6;a++) {
            if (level.includes(a)) {
                text="**Or we can choose something from level "+a+":**";
				for (b in voted) {
				    if (voted[b][2] == a) {
						text+="\n"+voted[b][0]+" "+voted[b][1]+": <https://darebee.com/programs/"+voted[b][3]+".html>"+(voted[b][4]!=""?" ("+voted[b][4]+")":"");
                        emotes.push(voted[b][0]);
                    }
                }
                chat(text,loc);
            }
        }
        
        // Votes will be tallied on [date] at [time].
        var date=new Date();
		date.setDate(date.getDate() + 2);
		chat("**VOTE HERE**\nRespond to **this** message with the emoji of your preferred program. Vote for as many as you want, though Discord only allows 20 different reacts. Votes will be tallied <t:"+date+":R> on <t:"+date+":F> or thereabouts. (If we EVER start a program and agree it's too challenging to keep up with, we can drop back and re-decide.)",loc)
        .then(async (message) => {
            temp.del("level");
            temp.set("program",message.id);
        })
    })
    .catch(console.error);
}

CountTies=function(votes) {
    var n=0;
	if (!votes) {
		chat("I guess you didn't want another program now. Hmm.",loc);
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
    DBAnnounce(program); // Announce winner and set new current
}

CountVotes=function(votes) {
    var n=0;
    if (votes.length==0) {
        chat("I guess you didn't want another program now. Hmm.",loc);
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
        Tie(program);
    }
    else {
		DBAnnounce(program); // Announce winner and set new program
    }
}

Count=function() {
	var votesID=temp.get("program");
	var tiesID=temp.get("tie");
	if (tiesID) countReacts(tiesID).then(votes=>{if (votes) CountTies(votes)});
	else if (votesID) countReacts(votesID).then(votes=>{if (votes) CountVotes(votes)});
}

// Vote among tied programs
Tie=function(program) {
	var ties=[];
	var emotes=[];
	
	for (a in program) {
		data.forEach((check)=>{if(check[0]==program[a]) ties.push(check);});
	}

	// Take the winning programs and restart vote among only them.
	text=ref+", we had a tie! Please vote from the programs listed below.\n\n";
	
	for (b in ties) {
		text+=ties[b][0]+" "+ties[b][1]+": <https://darebee.com/programs/"+ties[b][3]+".html>"+(ties[b][4]!=""?" ("+ties[b][4]+")":"")+"\n";
		emotes.push(ties[b][0]);
	}
	var date=new Date();
	date.setDate(date.getDate() + 2);
	text+="\n**VOTE HERE**\nRespond to **this** message with the emoji of your preferred program. Votes will be tallied <t:"+date+":R> on <t:"+date+":F> or thereabouts. A tie on this vote and I'll randomly chose one of those winners.";
	
	chat(text,loc).then(async (message) => {
		temp.del("program");
		temp.set("tie",message.id);
	})
	.catch(console.error);
}

// Announce winner and set new current
DBAnnounce=function(program) {
	if (Array.isArray(program)) {
		program=program[Math.floor(Math.random()*program.length)];
	}
	[winner]=data.filter((check)=>{return check[0]==program;});
	
	text=ref+", the results are in!\n\nOur new program will be:\n"+winner[0]+" "+winner[1]+": <https://darebee.com/programs/"+winner[3]+".html>"+(winner[4]!=""?" ("+winner[4]+")":"")+"\n\n";
	
	text+="We'll be starting it <t:"+start+":R> on <t:"+start+":F>.";
	temp.set("next",winner[0],dateForm(start,true));
	
	chat(text,loc).then(()=>{
		temp.del("tie");
		temp.del("program");
	})
	.catch(console.error);
}

//Set constants and variables
var file="./modules/DB/darebee.csv";
var loc;
var ref;
var workout;
var data=parseCSV(file);
var current=getCurrent(data); // Current program.
var shout=13; // Hours after midnight shout is scheduled for.
var currDate=new Date(current[current.length-1].split(/\D+/)); currDate=currDate.setHours(currDate.getHours()+shout); // Date that the current program started.
var currPart=current[5]||30; // Number of parts in the current program (defalts to 30).
var start=new Date(currDate);start.setDate(start.getDate()+(currPart)); // Date that the new program is set to start.

module.exports.shout=shout;
module.exports.nextProg=nextProg;
module.exports.currProg=currProg;
module.exports.Setup=Setup;
module.exports.Daily=Daily;
module.exports.Add=Add;
module.exports.Program=Program;
module.exports.Count=Count;
module.exports.Level=Level;
