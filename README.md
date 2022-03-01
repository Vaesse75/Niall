# Niall, the Habitica Village Crier Bot

Niall was created to automate some functions on my personal Habitica Discord server and to interact with users if they wanted.

## Modules

### Darebee

His biggest functionality is to do daily "shouts" to remind people it's time to workout and which program (from Darebee.com) has been selected and which part of the program is assigned for the day.

As the end of the program approaches, he automatically sets up voting for which program to run next, and when the new program is selected, he adjusts his data, shouting about the new program when the time comes.

### Habitica (currently running under Commands)

Though not used as extensively as Darebee, he also knows how to interact with the Habitica API on a basic level. To this end, when a new quest is initiated on Habitica, the user who posted the quest prompts Niall and he:
1. Checks to see if the user is the bot owner. If not, he opts into the quest for the bot owner.
2. Sends out a message pinging a Discord role to let them know a new quest is about to begin.
3. Sets a timer for 23 hours, after which he pings the role again with a "last call."
4. Sets a final timer for one hour, after which he starts the quest and says so in Discord.

### Birthdays

Not fully working yet, at the moment Niall knows how to make a record of each user's preferred nickname and birthday. The plan is for him to announce that birthday to Discord on the correct day (though exactly how that will be triggered hasn't yet been determined).

## Commands

Niall knows how to respond to a variety of simple triggered commands.

- **Help**: Gives a brief description of user-activated functions and how to use them.
- **Role**: Allows the user to change various roles, some being toggled (on/off) and some being switched (select one from...).
- **Roll**: A fairly robust random number generator.
- **Tips**: A list of random tips for my Discord server, Habitica, etc.

## Socials

So far Niall only has basic manners (hello, good bye, etc.) as social commands. But he has the ability to be easily expanded to respond to other social triggers.

## Core

Core functionality that's not visible to the user but makes programming easier.

## Logs

Four logs are kept:
- **seserr**: Session error log (resets automatically with each session)
- **sesout**: Session standard log (resets automatically with each session)
- **stderr**: Historic error log (must be cleared manually)
- **stdout**: Historic standard log (must be cleared manually)

## Temp.csv

This is a comma separated text file that can temporarily hold values for Niall between sessions (just in case he crashes).
