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

Toggle=function(msg,role) {
	if (msg) {
		roleObj=msg.guild.roles.cache.get(role);
	}
	
	if (!msg.member.roles.cache.has(role)) {
		// Add the role!
		msg.member.roles.add(role).catch(console.error);
		chat("Added role: **"+roleObj.name+"**",msg.channel);
	}
	if (msg.member.roles.cache.has(role)) {
		// Remove the role!
		msg.member.roles.remove(role).catch(console.error);
		chat("Removed role: **"+roleObj.name+"**",msg.channel);
	}
}

module.exports.Toggle=Toggle;
