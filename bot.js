/*
    Future Plans:
        Daily workout announcement
        Birthday greetings after first message
*/

// Set constants
const CronJob = require('cron').CronJob;
const Discord = require('discord.js');
const Niall = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = {};
const Em = {};
const Usr = {};
Rems=[];
cronjobs=[];

// Define Functions
Ch.get=function(id) {
    return Niall.channels.get(this[id.toLowerCase()]||id.toLowerCase());
};
Ch.ref=function(id) {
    return "<#"+(this[id.toLowerCase()]||id.toLowerCase())+">";
};
Ch.set=function(id,val) {
    this[id.toLowerCase()]=val;
};
function dailyworkout(program,part) {
    onconn.send(WorkoutRef+" Beginning our workout! Today's workout: <https://darebee.com/programs/"+program+".html?start="+part+"> (If you want to join us, now or in the future, let us know!)");
}
function Mbr(mem,leadcap) {
    if (leadcap) {
        return mem||"Friend";
    }
    else return mem||"friend";
}
Usr.ref=function(id) {
    return "<@&"+(this[id.toLowerCase()]||id.toLowerCase())+">";
};
Usr.set=function(id,val) {
    this[id.toLowerCase()]=val;
};

// acknowledge ready state
Niall.on('ready', () => {
    // console.log('Logged in as ${Niall.user.tag)!');
    
    fs.readFile('/home/Plex/Bot/Niall/remember.txt', 'utf8', function(err, contents) {
        var rems
        if (contents.substr(contents.length-2,contents.length-1)=="\n") {
            rems=contents.substr(0,contents.length-2).split("\n");
        }
        else {
            rems=contents.split("\n");
        }
        for (var a in rems) {
            rems[a]=rems[a].substr(1,rems[a].length-2).split("\",\"");
        }
        Rems=rems;
        for (var a in Rems) {
            if (Rems[a][0]=="dailyworkout") {
                    var c=0;
                    for (var b=Number(Rems[a][5]);b<=Number(Rems[a][6]);b++) {
                        var now=new Date();
                        //console.log(now.toISOString());
                        //var year=now.getFullYear();
                        var when=new Date()
                        when.setFullYear(now.getFullYear());
                        when.setMonth(Rems[a][1]-1);
                        when.setDate(Number(Rems[a][2])+ c);
                        when.setHours(Rems[a][3],0,0,0);
                        cronjobs.push(new CronJob(when,function() {Rems[a][4],dailyworkout((Number(Rems[a][5])+ c++).toString())},null,true,"America/New_York"));
                    }
            }
        }
    });
    
    //define Ch and Usr objects.
	Ch.set("inn","664197181846061080");
	Ch.set("guide","664199483025915904");
	Ch.set("quest","665311310581596160");
	Usr.set("leader","666316148589068328");
    Usr.set("workout","674677574898548766");
    
    // define frequently used channels.
    onconn = Ch.get("inn");
    GuideRef = Ch.ref("guide");
	QuestRef = Ch.ref("quest");
    WorkoutRef = Usr.ref("workout");
    
    // Wakeup message.
    var say=new Array("Ahem.");
	onconn.send(say[Math.floor(Math.random()*say.length)]);
});

// Reply to messages
Niall.on('message', msg => {
    
    //Plain text social responses
	if (msg.content.match(/^[Hh](e(llo)?|i|y)a?.* [Nn]iall.*/)) {
        var say=new Array("Hiya, "+Mbr(msg.member,0)+".","Hiya.");
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }
    if (msg.content.match(/^([Gg]ood ?)?([Bb]ye|[Nn](ight|ite)).* [Nn]iall.*/)) {
        var say=new Array("Later.","Later, "+Mbr(msg.member,0)+".");
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }
    if(msg.content.match(/[Mm]orning.* [Nn]iall.*/)) {
        var say=new Array("What's up?","What's up, "+Mbr(msg.member,0)+"?");
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }
    if(msg.content.match(/[Tt]hank(s.*| ?you.*) [Nn]iall.*/)) {
        var say=new Array("You got it.","Uh-huh.");
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }

    // ping reply
	if (msg.content.match(/^![Pp]ing/)) {
    }
    
    if (msg.content.match(/^![Rr]emembered$/)) {
        var toSay="";
        for (var a in Rems) {
                if (toSay != "") toSay+="\n"
            for (var b in Rems[a]) {
                if (toSay != "") toSay+=","
                toSay+="\""+Rems[a][b]+"\"";
            }
        }
        msg.channel.send(toSay);
    }
    
	//tips reply
	if (msg.content.match(/^![Tt]ip.?/)) {
		var say=new Array("Have you looked at our "+GuideRef+"?  It has LOTS of tips and tricks.","You can learn more about the three types of Habitica [tasks](https://discordapp.com/channels/664197181846061077/664199483025915904/664219509187411970) (Habits, Dailies, and To-Dos).","There's a pretty good description of the Habitica [classes](https://discordapp.com/channels/664197181846061077/664199483025915904/664219513172131843).","[Checklists](https://discordapp.com/channels/664197181846061077/664199483025915904/664219516519186473) behave differently in Dailies and To-Dos.","Our upcoming quests are listed in "+QuestRef+". If you have a quest you want added, let us know in "+onconn+".");
		var embed = new Discord.RichEmbed()
			.setDescription(say[Math.floor(Math.random()*say.length)]);
		msg.channel.send({ embed });
    }
    // help text
	if (msg.content.match(/^![Hh]elp/)||msg.content.match(/^[Hh]elp.*[Nn]iall.*/)) {
		msg.channel.send(Mbr(msg.member,1)+", here's what I can do!\r\n\r\n!tips - I'll give you a random tip.\r\n!help - I'll display this message.");
	}
	
});

// Member greeting
Niall.on('guildMemberAdd', member => {
    newconn.send("Welcome, "+Mbr(member,0)+"!");
});
Niall.login(auth.token);
