/*
    Future Plans:
        Daily workout announcement
        Birthday greetings after first message
*/

// Set constants
const Discord = require('discord.js');
const Niall = new Discord.Client();
const CronJob = require('cron').CronJob;
const auth = require('/home/plex/bots/authNiall.json');
const fs = require('fs');
const Ch = {};
const Em = {};
const Usr = {};
Rems=[];

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

    fs.readFile('/home/Plex/Bot/Niall/rememer.txt', 'utf8', function(err, contents) {
        var rems=contents.split("\n");
        for (var a in rems) {
            rems[a]=rems[a].substr(1,recs[a].length-2).split("\",\"");
        }
	Rems=rems;
	console.log(Rems);
    });
    //define Ch and Usr objects.
	Ch.set("inn","664197181846061080");
	Ch.set("guide","664199483025915904");
	Usr.set("leader","666316148589068328");
    
    // define frequently used channels.
    onconn = Ch.get("inn");
    GuideRef = Ch.ref("guide");
    
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
    
	//tips reply
	if (msg.content.match(/^![Tt]ip.?/)) {
		var say=new Array("Have you looked at our "+GuideRef+"?  It has LOTS of tips and tricks.");
         msg.channel.send(say[Math.floor(Math.random()*say.length)]);
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
