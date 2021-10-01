QuestRef = Ch.ref("quest");
GemRef = Ch.ref("gem");
DBChan = Ch.ref("darebee");
testRef = Ch.ref("test");
CalRef = Ch.ref("calendar");

module.exports = {
	name: 'she',
	aliases: ['her'],
	description: "Toggles on and off the She/Her pronoun role.",
	usage: `\`!she\`, \`!her\``,
	execute(msg, args) {
		Role.Toggle(msg,"668111455475859488");
	},
	name: 'he',
	aliases: ['him'],
	description: "Toggles on and off the He/Him pronoun role.",
	usage: `\`!he\`, \`!him\``,
	execute(msg, args) {
		Role.Toggle(msg,"668111419262238750");
	},
	name: 'they',
	aliases: ['them'],
	description: "Toggles on and off the They/Them pronoun role.",
	usage: `\`!they\`, \`!them\``,
	execute(msg, args) {
		Role.Toggle(msg,"668111380913717272");
	},
	name: 'quester',
	description: "Toggles on and off the Quester role (get tagged an hour before quests go live).",
	usage: `\`!quester\``,
	execute(msg, args) {
		Role.Toggle(msg,"693612089134153829");
	},
	name: 'workout',
	description: "Toggle participation and tagging for daily workouts. (In the "+DBChan+".)",
	usage: `\`!roll\`, \`!roll d6\`, \`!roll 1d20\`, between 1-10 dice, 4-100 sides.`,
	execute(msg, args) {
		Role.Toggle(msg,"674677574898548766");
	},
	name: 'calendar',
	description: "Toggles on and off the Calendar Quest role (we play every other Sunday in the "+CalRef+" channel).",
	usage: `\`!calendar\``,
	execute(msg, args) {
		Role.Toggle(msg,"693612089134153829");
	},
	name: 'spectator',
	description: "Toggles ability to observe the "+testRef+".  (You may get extra wrong pings with it on.)",
	usage: `\`!spectator\``,
	execute(msg, args) {
		Role.Toggle(msg,"696409841538695278");
	},
	name: 'donor',
	description: "Toggles Gem Donor role, see pinned message in "+GemRef+" for details.",
	usage: `\`!donor\``,
	execute(msg, args) {
		Role.Toggle(msg,"759087823394439218");
	},
	name: 'class',
	args: true,
	description: "Switch to the chosen class. (You choose your class in Habitica at level 10.)",
	usage: `\`!class healer\`, \`!class mage\`, \`!class rogue\`, \`!class warrior\``,
	execute(msg, args) {
		healer = "667128174362230829";
		mage = "667128239520481288";
		rogue = "667128440209670173";
		warrior = "667128210802081803";
		msg.member.roles.remove(healer).catch(console.error); // Remove healer
		msg.member.roles.remove(mage).catch(console.error); // Remove mage
		msg.member.roles.remove(rogue).catch(console.error); // Remove rogue
		msg.member.roles.remove(warrior).catch(console.error); // Remove warrior
		
		switch (args[0]) {
			case "healer": 
				msg.member.roles.add(healer).catch(console.error);
				chat("Switched to **Healer** role.",msg.channel);
				break;
			case "mage":
				msg.member.roles.add(mage).catch(console.error);
				chat("Switched to **Mage** role.",msg.channel);
				break;
			case "rogue":
				msg.member.roles.add(rogue).catch(console.error);
				chat("Switched to **Rogue** role.",msg.channel);
				break;
			case "warrior":
				msg.member.roles.add(warrior).catch(console.error);
				chat("Switched to **Warrior** role.",msg.channel);
				break;
			default:
				chat("I don't know what class "+args+" is. I already cleared your old class, though. Try again using "+this.usage+".",msg.channel)
		}
	}
}

