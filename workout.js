//Set contants and variables
var fs = require('fs');
var file="/home/Plex/Bot/Niall/workout.csv";

// Announce today's workout
module.exports.Daily=function(program, part, callback) {
	callback(WorkoutRef+" Beginning our workout! Today's workout: <https://darebee.com/programs/"+program+".html?start="+part+"> (If you want to join us, now or in the future, let us know!)");
}

// Schedule the workout
module.exports.Schedule=function(callback, callback2) {
	// Import data
	fs.readFile(file, 'utf8', function(err, contents) {
		var rems
		if (contents.substr(contents.length-2,contents.length-1)=="\n") {
			rems=contents.substr(0,contents.length-2).split("\n");
		}
		else {
			rems=contents.split("\n");
		}
		for (var a in rems) {
			rems[a]=rems[a].substr(1,rems[a].length-2).split("\",\"");
		}
		Rems=rems;
		for (var a in Rems) {
			for (var b=0;Number(Rems[a][4])+b<=Number(Rems[a][5]);b++) {
				var CronJob = require('cron').CronJob;
				var now=new Date();
				var when=new Date(now.getFullYear(), (Number(Rems[a][0])-1), (Number(Rems[a][1])+ b), Number(Rems[a][2]), 0, 0, 0)
					//for debugging
					//when.setDate(Number(Rems[a][1])+ b-1); // Set it back a day from actual
					when.setHours(17,44,0,0); // Set time to (hour, minute, second, mill)
				if (when > now) {
					cronjobs.push(new CronJob(when,function(){callback(Rems[a][3],(Number(Rems[a][4])+ b),callback2)},null,true,"America/New_York"));
				}
			}
		}
	});
}
