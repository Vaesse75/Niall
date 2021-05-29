module.exports = {
	name: 'time',
	aliases: ['date'],
	description: "I'll tell you what time it is for me.  (Useful when comparing to other times I may give.)",
	usage: `\`!time\`, \`!date\``,
	execute(msg, args) {
		var dt=new Date();
		return "The current date is: "+dt.getFullYear().toString().padStart(4,'0')+"-"+(dt.getMonth()+1).toString().padStart(2,'0')+"-"+dt.getDate().toString().padStart(2,'0')+" at "+dt.getHours().toString().padStart(2,'0')+":"+dt.getMinutes().toString().padStart(2,'0');
	}
}
