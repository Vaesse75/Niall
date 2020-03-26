/*
    Future Plans:
        Daily workout announcement
        Birthday greetings after first message
*/

// Set constants
const Discord = require('discord.js');
const Niall = new Discord.Client();
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = {};
const Em = {};
const Usr = {};
Rems=[];
cronjobs=[];
workoutinfo=[];
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
function dailyworkout(obj) {
    //onconn.send
    console.log(WorkoutRef+" Beginning our workout! Today's workout: <https://darebee.com/programs/"+obj.program+".html?start="+obj.part+"> (If you want to join us, now or in the future, let us know!)");
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
    
    fs.readFile('/home/Plex/Bot/Niall/remember.csv', 'utf8', function(err, contents) {
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
                    function Workoutdata(a,b) {
                        this.program=a;
                        this.part=b;
                    }
                    for (var b=0;Number(Rems[a][5])+b<=Number(Rems[a][6]);b++) {
                        var CronJob = require('cron').CronJob;
                        var now=new Date();
                        var when=new Date(now.getFullYear(), Number(Rems[a][1]-1), (Number(Rems[a][2])+ b), Number(Rems[a][3]), 0, 0, 0)
                        /* for debugging
                        when.setDate(Number(Rems[a][2])+ b-1);
                        when.setHours(14,53,0,0); */
                        var d=new Workoutdata(Rems[a][4],(Number(Rems[a][5])+ b));
                        if (when > now) {
                            cronjobs.push(new CronJob(when,function(){dailyworkout(d)},null,true,"America/New_York"));
                        }
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
    var say=["Ahem."];
	//onconn.send(say[Math.floor(Math.random()*say.length)]);
});

// Reply to messages
Niall.on('message', msg => {
    
    //Plain text social responses
	if (msg.content.match(/^[Hh](e(llo)?|i|y)a?.* [Nn]iall.*/)) {
        var say=["Hiya, "+Mbr(msg.member,0)+".","Hiya."];
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }
    if (msg.content.match(/^([Gg]ood ?)?([Bb]ye|[Nn](ight|ite)).* [Nn]iall.*/)) {
        var say=["Later.","Later, "+Mbr(msg.member,0)+"."];
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }
    if(msg.content.match(/[Mm]orning.* [Nn]iall.*/)) {
        var say=["What's up?","What's up, "+Mbr(msg.member,0)+"?"];
        msg.channel.send(say[Math.floor(Math.random()*say.length)]);
    }
    if(msg.content.match(/[Tt]hank(s.*| ?you.*) [Nn]iall.*/)) {
        var say=["You got it.","Uh-huh."];
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
		var say=["Have you looked at our "+GuideRef+"?  It has LOTS of tips and tricks.","You can learn more about the three types of Habitica [tasks](https://discordapp.com/channels/664197181846061077/664199483025915904/664219509187411970) (Habits, Dailies, and To-Dos).","There's a pretty good description of the Habitica [classes](https://discordapp.com/channels/664197181846061077/664199483025915904/664219513172131843).","[Checklists](https://discordapp.com/channels/664197181846061077/664199483025915904/664219516519186473) behave differently in Dailies and To-Dos.","Our upcoming quests are listed in "+QuestRef+". If you have a quest you want added, let us know in "+onconn+"."];
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
