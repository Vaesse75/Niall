module.exports=function(input) {
	if (input.match(/h(e(llo)?|i|y)a?.* niall.*?/)) {
		var say=[
			"Hiya.",
			"Heya.",
			"Hey.",
			"Hi.",
			"Hello.",
			"Huh?"
		];
		return (say[Math.floor(Math.random()*say.length)]);
	}
	if (input.match(/(good ?)?(bye|n(ight|ite)).* niall.*?/)) {
		var say=[
			"Later.",
			"Rest well.",
			"Sleep well.",
			"Until the morrow.",
			"G'evening."
		];
		return (say[Math.floor(Math.random()*say.length)]);
	}
	if (input.match(/morning.* niall.*?/)) {
		var say=[
			"What's up?",
			"Morning.",
			"It is.",
			"Yup.",
			"Ugh.",
			"Again?",
			"Already?"
		];
		return (say[Math.floor(Math.random()*say.length)]);
	}
	if (input.match(/thank(s.*| ?you.*) niall.*?/)) {
		var say=[
			"You got it.",
			"Uh-huh.",
			"As you wish.",
			"Sure."
		];
		return (say[Math.floor(Math.random()*say.length)]);
	}
};
