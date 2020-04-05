module.exports=function(input,say,chan) {
	var text=[];
	if (input.match(/^h(e(llo)?|i|y)a?.* niall.*?/)) {
		text=[
			"Hiya.",
			"Heya.",
			"Hey.",
			"Hi.",
			"Hello.",
			"Huh?"
		];
	}
	if (input.match(/(good ?)?(bye|n(ight|ite)).* niall.*?/)) {
		text=[
			"Later.",
			"Rest well.",
			"Sleep well.",
			"Until the morrow.",
			"G'evening."
		];
	}
	if (input.match(/morning.* niall.*?/)) {
		text=[
			"What's up?",
			"Morning.",
			"It is.",
			"Yup.",
			"Ugh.",
			"Again?",
			"Already?"
		];
	}
	if (input.match(/thank(s.*| ?you.*) niall.*?/)) {
		text=[
			"You got it.",
			"Uh-huh.",
			"As you wish.",
			"Sure."
		];
	}
	say(text[Math.floor(Math.random()*say.length)],chan);
};
