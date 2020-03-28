//Set contants and variables
var fs = require('fs');
var file="/home/Plex/Bot/Niall/birthday.csv";

months=function(num) {
    var arr=["January","February","March","April","May","June","July","August","September","October","November","December"];
    return arr[Number(num)-1];
}

nth=function(d) {
	switch (d % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}

module.exports.Add=function(msg, say) {
	// Declare variables
	var input=msg.content;
	var ID=msg.author.id;
	var info=input.match(/!bday (.+?) (\d{2}) (\d{2})/);
	
	if (info && info.length==4) {
        var name=info[1];
        var day=info[3];
        var month=info[2];
		// Confirm correct information
		say("Just to confirm, I have you as "+name+", born the "+Number(day)+nth(day)+" day of "+months(month)+". If this is wrong or you need to change it later, give me the data again (starting with the !bday trigger).");
		// Record to csv file
		fs.appendFileSync(file, '"'+ID+'","'+name+'","'+day+'","'+month+'",""\n');
		say("I've added your information to my book.");
		return module.exports.Import();
	}
	else {
		// Respond to function call and ask for birthady
		say("If you tell me your birthday, I'll try to remember to celebrate it with you.\n\nI'll need (separated by spaces):\n**!bday**, your **preferred name**, birth **month** (01-12), birth **day** (01-31).");
	}
}

module.exports.Import=function() {
	var sch; // Array (0 indexed)
	var temp; // String for file write
	var dates=[];; // Keyed array
	contents=fs.readFileSync(file, 'utf8');
	if (contents.substr(contents.length-1,1)=="\n") {
		contents=contents.substr(0,contents.length-1);
	}
	sch=contents.split("\n");
	//sch.pop();
	for (var a in sch) {
		if (sch[a][0] != "" ) {
			sch[a]=sch[a].substr(1,sch[a].length-2).split('","');
			dates[sch[a][0]]=sch[a].slice(1);
		}
	}
	// Remove old/dupilcate entries
	sch=[];
	var b=0;
	for (var a in dates) {
		sch[b++]=`"`+a+'","'+dates[a].join('","')+'"';
	}
	temp=sch.join("\n")+"\n";
	fs.writeFileSync(file, temp);
	return dates;
}

module.exports.Check=function(ID,Sch,say) {
	var now=new Date();
	// Check for correct date and message from user
	if (Sch && Sch.length == 4 && Number(Sch[1])==now.getDate() && Number(Sch[2])==now.getMonth()+1 && Number(Sch[3])!=now.getFullYear()) {
		fs.appendFileSync(file, '"'+ID+'","'+Sch[0]+'","'+Sch[1]+'","'+Sch[2]+'","'+now.getFullYear()+'"\n');
		var choose=["It looks like today is your birthday, "+Sch[0]+".  Hope it's wonderful!"];
		say(choose[Math.floor(Math.random()*say.length)]);
		return module.exports.Import();
	}
}
