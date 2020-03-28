module.exports=function(input) {
	if (input.match(/^!tip.?/)) {
		var say=["Have you looked at our "+GuideRef+"?  It has LOTS of tips and tricks.","You can learn more about the three types of Habitica [tasks](https://discordapp.com/channels/664197181846061077/664199483025915904/664219509187411970) (Habits, Dailies, and To-Dos) in our adventure guide.","There's a pretty good description of the Habitica [classes](https://discordapp.com/channels/664197181846061077/664199483025915904/664219513172131843) in our adventure guide.","[Checklists](https://discordapp.com/channels/664197181846061077/664199483025915904/664219516519186473) behave differently in Dailies and To-Dos.","Our upcoming quests are listed in "+QuestRef+". If you have a quest you want added, let us know in "+onconn+"."];
		return (say[Math.floor(Math.random()*say.length)]);
	}
};
