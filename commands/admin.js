module.exports = {
	name: 'dbprogram',
	description: "This allows admin to add a new Darebee program to the list.",
	usage: `\`!dprogram <"name"> <"level (1-5, integers only)"> <"URL (after http://darebee.com/programs/)"> <"emoji (in unicode)"> ["notes"] ["days (defaults to 30"]\` Note that all arguments must be surrounded by double quotes and must remain in order.`,
	execute(msg, args) {
		// var info=input.match(/^!dbprogram \"(.+)\" \"([1-5])\" \"(.+)\" \"(.+)\" \"(.*)\" \"([1-5]{2})?\"/);
		/* var name=info[1];
		 * var level=info[2];
		 * var URL=info[3];
		 * var emoji=info[4];
		 * var notes=info[5];
		 * var days=info[6]
		 */
		if (msg.member.roles.cache.has("666316148589068328") || msg.member.roles.cache.has("718154951414513684")) {
			DB.Add(msg);
		}
	}
}
