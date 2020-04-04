var fs = require('fs');
var file="./temp.csv";

// Read CSV file, return array.
parseCSV=function(file,a) {
	var contents=fs.readFileSync(file, 'utf8');
	while (contents.slice(-1)=="\n") contents=contents.slice(0,-1);
	arr=contents.split("\n").map((line)=>{return line.slice(1,-1).split('","');});
	if (a) {
		aarr=[];
		arr.forEach((line)=>{var key=line.shift();aarr[key]=line.length==1?line[0]:line;});
		arr=aarr;
	}
	return arr;
}

get=function(key) {
	if (!key) {
		return false;
	}
	return temp[key];
}

set=function(key,input) {
	if (!key||!input) {
		return false;
	}
	temp[key]=input;
	write();
}

del=function(key) {
	if (!key) {
		return true;
	}
	delete temp[key];
	write();
}

write=function() {
	// Convert temp to csv
    var csv=[];
    for (key in temp) {
        var data=temp[key];
        if (Array.isArray(data)) {
            data=data.join('","');
        }
        csv.push('"'+key+'","'+data+'"');
    }
    csv=csv.join("\n")+"\n";
	// Do the write
	fs.writeFileSync(file, csv);
}

temp=parseCSV(file,1);
module.exports.get=get;
module.exports.set=set;
module.exports.del=del;
