var roleObj;

this.get=function(id) {
	return this[id.toLowerCase()]||id.toLowerCase();
}
this.ref=function(id) {
    return "<@&"+(this[id.toLowerCase()]||id.toLowerCase())+">";
}
this.set=function(id,val) {
    this[id.toLowerCase()]=val;
}

Toggle=function(msg,role,say) {
	if (msg) {
		roleObj=msg.guild.roles.cache.get(role);
	}
	
	if (!msg.member.roles.cache.has(role)) {
		// Add the role!
		msg.member.roles.add(role).catch(console.error);
		say("Added role: **"+roleObj.name+"**",msg.channel);
	}
	if (msg.member.roles.cache.has(role)) {
		// Remove a role!
		say("Removed role: **"+roleObj.name+"**",msg.channel);
		msg.member.roles.remove(role).catch(console.error);
	}
}

Class=function(msg,role,say) {
	msg.member.roles.remove("667128174362230829").catch(console.error); // Remove healer
	msg.member.roles.remove("667128210802081803").catch(console.error); // Remove warrior
	msg.member.roles.remove("667128239520481288").catch(console.error); // Remove mage
	msg.member.roles.remove("667128440209670173").catch(console.error); // Remove rogue
	
	switch (role) {
		case "healer": 
			msg.member.roles.add("667128174362230829").catch(console.error);
			say("Switched to **Healer** role.",msg.channel);
			break;
		case "warrior":
			msg.member.roles.add("667128210802081803").catch(console.error);
			say("Switched to **Warrior** role.",msg.channel);
			break;
		case "mage":
			msg.member.roles.add("667128239520481288").catch(console.error);
			say("Switched to **Mage** role.",msg.channel);
			break;
		case "rogue":
			msg.member.roles.add("667128440209670173").catch(console.error);
			say("Switched to **Rogue** role.",msg.channel);
			break;
	}
}
module.exports.Toggle=Toggle;
module.exports.Class=Class;
