module.exports={
	hi:{
		trigger(msg) {
			return !!(msg.content.match(/^h(e(llo)?|i|y)a?.* niall.*?/i));
		},
		execute(msg) {
			return [
				"Hiya.",
				"Heya.",
				"Hey.",
				"Hi.",
				"Hello.",
				"Huh?"
			];
		}
	},
	bye:{
		trigger(msg) {
			return !!(msg.content.match(/(good ?)?(bye|n(ight|ite)).* niall.*?/i));
		},
		execute(msg) {
			return [
				"Later.",
				"Rest well.",
				"Sleep well.",
				"Until the morrow.",
				"G'evening."
			];
		}
	},
	morning:{
		trigger(msg) {
			return !!(msg.content.match(/morning.* niall.*?/i));
		},
		execute(msg) {
			return [
				"What's up?",
				"Morning.",
				"It is.",
				"Yup.",
				"Ugh.",
				"Again?",
				"Already?"
			];
		}
	},
	thank:{
		trigger(msg) {
			return !!(msg.content.match(/thank(s.*| ?you.*) niall.*?/i));
		},
		execute(msg) {
			return [
				"You got it.",
				"Uh-huh.",
				"As you wish.",
				"Sure."
			];
		}
	}
}
