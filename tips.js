module.exports=function(input,say,chan,color) {
	if (input.match(/^!tip.?/)) {
		var text=[
			"Have you looked at our "+GuideRef+"?  It has LOTS of tips and tricks.",
			"You can learn more about the three types of Habitica [tasks](https://discordapp.com/channels/664197181846061077/664199483025915904/664219509187411970) (Habits, Dailies, and To-Dos) in our adventure guide.",
			"There's a pretty good description of the Habitica [classes](https://discordapp.com/channels/664197181846061077/664199483025915904/664219513172131843) in our adventure guide.",
			"[Checklists](https://discordapp.com/channels/664197181846061077/664199483025915904/664219516519186473) behave differently in Dailies and To-Dos.",
			"Our upcoming quests are listed in "+QuestRef+". If you have a quest you want added, let us know in "+onConn+".",
			"Make sure your Dailies are things that are generally achievable. Other repeating tasks that you're trying to work on should start as Habits and then recreate them as Dailies when you think you can accomplish them more often than not.",
			"Habitica is supposed to be encouraging and fun, not overwhelming.  If you haven't found that balance, it's possible other party members can help!",
			"Looking for new things to add to your tasks?  Check out the **Take This** challenges.  Click [here](https://habitica.com/challenges/findChallenges) then check the Habitica Official box.",
			"**Method for Deciding When There Are No Pros or Cons to Use**\n- First make a list of everything you're deciding between.\n- Then number everything on the list.\n- Then use a random number generator (or a die) to choose a number.\n- If you **immediately** wish another number came up, that's your answer.\n- Otherwise, choose whatever was selected.",
			"Break as many things as you can into smaller steps. This can be done by checklists in daily or to-dos or extra habits.  Ask your party members if you need help broking a task down.",
			"Regularly check your task lists to ensure they're still appropriate (not too hard or too easy) and relevant (something you're working on or want to be working on).  Maybe create a Daily (set to monthly or every three months) task to do this.",
			"For some suggestions on how to get out of the Tavern, [check this out](https://discord.com/channels/664197181846061077/664199483025915904/664219548756738052).",
			"To make sure your goals are clear and reachable, each one should be:\n**S**pecific (Walk for 30 minutes *instead of* Exercise)\n**M**easurable (Save $20 *instead of* Save money)\n**A**ttainable (is this something *you* can do?)\n**R**elevant (is this going to make you or your life better)**T**imely (setting a time frame can help keep you on target)\n\n[More Details/Examples Here](https://habitica.fandom.com/wiki/SMART_Goal_Setting)"
		];
		say(text[Math.floor(Math.random()*text.length)],chan,color);
	}
};
