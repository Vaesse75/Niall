module.exports = {
	name: 'roll',
	aliases: ['dice'],
	description: 'Rolls the given number of dice. Default is 1d6.',
	usage: `\`!roll\`, \`!roll d6\`, \`!roll 1d20\`, between 1-10 dice, 4-100 sides.`,
	execute(msg, args) {
		let chan=msg.channel,user=msg.reply,bot=msg.client,text;
		if (args.length==0){args.push("1d6")}
		while (args.length>0) {
			let errd;
			roll=args.shift();
			decode=roll.match(/(\d*)d(\d+)/i);
			let help=` Type \`!help roll\` for help.`;
			let errr=`${roll} is invalid.`;
			if (!decode||decode.length != 3) {
				text+=errr+help+"\n";
			}
			else {
				dice=((decode[1]||1)*1);
				sides=(decode[2]*1);
				text=`I rolled ${roll} for you, you got: `;
				if (dice>10) {
					text=errr+help+"\n";
				}
				else if (sides<4) {
					text=errr+help+"\n";
				}
				else if (sides>100) {
					text=errr+help+"\n";
				}
				else {
					let total=0;
					for (let i=0;i<dice;i++) {
						save=Math.floor(Math.random()*sides)+1;
						text+=save;
						total+=save;
						if (i<(dice-1)) {
							text+=" + ";
						}
						else if (i>0) {
							text+=" = "+total;
						}
					}
				}
				text+="\n";
			}
		}
		return text;
		
		/*msg.reply(text).catch(error => {
			console.error(`There was an issue rolling the dice.`, error);
			chan.send(`Invalid die roll.`);
		});*/
	}
}
