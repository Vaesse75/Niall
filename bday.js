//Set contants and variables
var fs = require('fs');
var file="./birthday.csv";
Schedule=[];

months=function(num) {
    var arr=["January","February","March","April","May","June","July","August","September","October","November","December"];
    return arr[Number(num)-1];
}

nth=function(d) {
	if (d==11||d==12||d==13) return "th";
	switch (d % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}

Import=function() {
	var sch; // Array (0 indexed)
	var temp; // String for file write
	var dates=[]; // Keyed array
	
	// Read the file
	contents=fs.readFileSync(file, 'utf8');
	
	// Remove trailing hard return(s)
	while (contents.slice(-1)=="\n") {
		contents=contents.slice(0,-1);
	}
	
	// Creating array of strings by lines
	sch=contents.split("\n");
	
	// Split strings into sub-arrays and dupe check
	for (var a in sch) {
		if (sch[a][0] != "" ) {
			// Split strings into sub-arrays
			sch[a]=sch[a].slice(1,-1).split('","');
			// Move ID to key to dupe check
			dates[sch[a][0]]=sch[a].slice(1);
		}
	}

	// Pass clean keyed data to Schedule
	Schedule=dates;

	// Write the clean file
	sch=[];
	for (var a in dates) {
		sch.push('"'+a+'","'+dates[a].join('","')+'"');
	}
	temp=sch.join("\n")+"\n";
	fs.writeFileSync(file, temp);
}

module.exports.Add=function(msg, say) {
	// Declare variables
	var input=msg.content;
	var ID=msg.author.id;
	var info=input.match(/^!bday (.+?) (\d{2}) (\d{2})/);
	
	if (info && info.length==4) {
        var name=info[1];
		var month=info[2];
		var day=info[3];
		
		// Confirm correct information
		say("Just to confirm, I have you as "+name+", born the "+Number(day)+nth(day)+" day of "+months(month)+". If this is wrong or you need to change it later, give me the data again (starting with the !bday trigger).",msg.channel);
		
		// Record to csv file
		fs.appendFileSync(file, '"'+ID+'","'+name+'","'+day+'","'+month+'",""\n');
		say("I've added your information to my book.",msg.channel);
		
		Import();
	}
	else {
		// Respond to function call and ask for birthday
		say("If you tell me your birthday, I'll try to remember to celebrate it with you.\n\nI'll need (separated by spaces):\n**!bday**, your **preferred name**, birth **month** (01-12), birth **day** (01-31).",msg.channel);
	}
}

module.exports.Daily=function(say,chan) {
	for (ID in Schedule) {
		module.exports.Check(ID,say,chan);
	}
}

module.exports.Check=function(ID,say,chan) {
	if (ID in Schedule) {
		var now=new Date();
		var Sch=Schedule[ID];
		
		Announce(ID,Sch,say,chan);
	}
}

Announce=function(ID,Sch,say,chan) {
	// Check for correct date and message from user
	if (Sch.length == 4 && Number(Sch[3])!=now.getFullYear() && Number(Sch[2])==now.getMonth()+1 && Number(Sch[1])==now.getDate()) {
		fs.appendFileSync(file, '"'+ID+'","'+Sch[0]+'","'+Sch[1]+'","'+Sch[2]+'","'+now.getFullYear()+'"\n');
		var text=[
		"<@"+ID+"> It looks like today is "+Sch[0]+"'s birthday.  Hope it's wonderful!",
		"<@"+ID+"> Hey everyone!  It's "+Sch[0]+"'s birthday!  Time to throw a party!",
		"<@"+ID+"> Pssst! Everyone, I heard it's "+Sch[0]+"'s birthday."
		];
		
		Import();
		
		say(text[Math.floor(Math.random()*say.length)],chan);
		}
}

Import();
