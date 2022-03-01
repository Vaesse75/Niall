DBChan = Ch.ref("darebee");
testRef = Ch.ref("test");
GemRef = Ch.ref("gem");
CalRef = Ch.ref("calendar");

module.exports = {
	name: 'help',
	description: "I'll display this message.",
	usage: `\`!help\``,
	execute(msg, args) {
		chat(Mbr(msg.member,1)+", here's what I can do!\n\n"
		+"**!tip** - I'll give you a random tip.\n"
		+"**!bday** - Tell me your birthday so we can celebrate together. (Note: Currently I'm keeping track of birthdays, but not actually announcing them.)\n"
		+"**!quest** - Use this when you que a new quest and I'll send out quest reminders.\n"
		+"**!roll** - Rolls the given number of dice. Default is 1d6.\n"
		
		+"\nDAREBEE\n"
		+"**!daily** - If I've forgotten to do my daily shout, this is how you remind me.\n"
		+"**!current** - I'll tell you what program we're currently working on.\n"
		+"**!next** - I'll tell you what the next program swill be. (Note: This will only give a real answer after we've selected but before we've started the next program.\n"
		
		+"\nROLES\n"
		+"**!she** - Toggles on and off the She/Her pronoun role.\n"
		+"**!he** - Toggles on and off the He/Him pronoun role.\n"
		+"**!they** - Toggles on and off the They/Them pronoun role.\n"
		+"**!quester** - Toggles on and off the Quester role (get tagged an hour before quests go live).\n"
		+"**!workout** - Toggle participation and tagging for daily workouts. (In the "+DBChan+".)\n"
		+"**!spectator** - Toggles ability to observe the "+testRef+".  (You may get extra wrong pings with it on.)\n"
		+"**!calendar** - Toggles on and off the Calendar Quest role (we play every other Sunday in the "+CalRef+" channel).\n"
		+"**!donor** - Toggles Gem Donor role, see pinned message in "+GemRef+" for details.\n"
		+"**!class <healer|mage|rogue|warrior>** - Switch to the chosen class. (You choose your class in Habitica at level 10.)\n"
		
		+"\n**!help** - I'll display this message.",msg.channel)
	}
}
