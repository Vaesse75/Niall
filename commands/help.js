DBChan = Ch.ref("darebee");
testRef = Ch.ref("test");
GemRef = Ch.ref("gem");

module.exports = {
	name: 'help',
	description: "I'll display this message.",
	usage: `\`!help\``,
	execute(msg, args) {
		chat(Mbr(msg.member,1)+", here's what I can do!\n\n"
		+"**!tip** - I'll give you a random tip.\n"
		+"**!time** - I'll tell you what time it is for me.  (Useful when comparing to other times I may give.)\n"
		+"**!bday** - Tell me your birthday so we can celebrate together.\n"
		+"**!quest** - Use this when you que a new quest and I'll let our Questers know when there's an hour left until the quest is set to start.\n"
		+"**!roll** - Rolls the given number of dice. Default is 1d6.\n"
		
		+"\nROLES\n"
		+"**!she** - Toggles on and off the She/Her pronoun role.\n"
		+"**!he** - Toggles on and off the He/Him pronoun role.\n"
		+"**!they** - Toggles on and off the They/Them pronoun role.\n"
		+"**!quester** - Toggles on and off the Quester role (get tagged an hour before quests go live).\n"
		+"**!workout** - Toggle participation and tagging for daily workouts. (In the "+DBChan+".)\n"
		+"**!spectator** - Toggles ability to observe the "+testRef+".  (You may get extra wrong pings with it on.)\n"
		+"**!donor** - Toggles inclusion in the list of people willing to offer gem rewards for special tasks, see pinned message in "+GemRef+" for details.\n"
		+"**!class <healer|mage|rogue|warrior>** - Switch to the chosen class. (You choose your class in Habitica at level 10.)\n"
		
		+"\n**!help** - I'll display this message.",msg.channel)
	}
}
