//SETTINGS VAR
var token = 'my-telegram-bot-token'; //INSERT HERE YOUR AUTHENTICATION TOKEN PROVIDED BY @BotFather
var AUTHID = 'my-telegram-id'; //INSERT HERE YOUR UNIQUE ID, YOU CAN FIND IT STARTING THE BOT AND SENDING THE COMMAND /myid
var botname = 'my-bot-name'; //INSERT YOUR YOUR BOT NAME (OR WHAT YOU PREFERE)


var TEMP_LIMIT = 60;
var tempLimitToggle = false;
var setIntervalTemp;

var Bot = require('node-telegram-bot-api'),
    bot = new Bot(token, { polling: true });

var sys = require('util'),
  exec = require('child_process').exec,
  child;


console.log('Bot @'+botname+' - server started...');


send("@"+botname+" is now up!", AUTHID); //THE BOT WILL SEND THIS MESSAGE AT THE START


bot.onText(/^\/temp_limit on (\d{2})$/, function (msg, match) {
	var limit = match[1];
	console.log(limit);
	if(msg.chat.id == AUTHID){
		if(tempLimitToggle == false){
			tempLimitToggle = true;
			TEMP_LIMIT = limit;
			if (setIntervalTemp) clearInterval(setIntervalTemp);
			setIntervalTemp = setInterval(function(){
								if(tempLimitToggle)
								child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
										if (error == null){
											var temp = parseFloat(stdout)/1000;
											if(temp>=TEMP_LIMIT){
												console.log("reached");
												send("WARNING!: " + TEMP_LIMIT + "° reached! Temp: " + temp + "°", AUTHID);
											}
										}
									});
							},10000);
			send("Warning for temperature limit ON: "+limit+"°", msg.chat.id);

		}else{
			TEMP_LIMIT = limit;
			send("Warning for temperature limit updated to: " + TEMP_LIMIT + "°", msg.chat.id);
		}
	}
});

bot.onText(/^\/temp_limit off$/, function (msg, match) {
	if(msg.chat.id == AUTHID){
		if(tempLimitToggle == true){
			tempLimitToggle = false;
			clearInterval(setIntervalTemp);
			send("Warning for temperature limit OFF!", msg.chat.id);
		}
	}
});

bot.onText(/^\/temp$/, function(msg, match){
	var reply = "";
	if(msg.chat.id == AUTHID){
		child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
				reply = "Error: " + error;
				send(reply, msg.chat.id);
			} else {
				var temp = parseFloat(stdout)/1000;
				reply = "Temperature: " + temp + "°";
				console.log(msg.chat.id);
				send(reply, msg.chat.id);
			}
		});
	}
});

bot.onText(/^\/cpu$/, function(msg, match){
	var reply = "";
	if(msg.chat.id == AUTHID){
		child = exec("top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{print $2 + $4}'", function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
				reply = "Error: " + error;
				send(reply, msg.chat.id);
			} else {
				var cpu = parseFloat(stdout);
				reply = "CPU Load: " + cpu + "%";
				console.log(msg.chat.id);
				send(reply, msg.chat.id);
			}
		});
	}
});

bot.onText(/^\/reboot$/, function(msg, match){
	var reply = "";
	if(msg.chat.id == AUTHID){
		send("Rebooting Raspberry Pi!", msg.chat.id);
		console.log("rebooting");

		setInterval(function(){child = exec("sudo reboot", function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
					reply = "Error: " + error;
					send(reply, msg.chat.id);
				}
			});
		},5000);
	}
});

bot.onText(/^\/cpu$/, function(msg, match){
	var reply = "";
	if(msg.chat.id == AUTHID){
		child = exec("top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{print $2 + $4}'", function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
				reply = "Error: " + error;
				send(reply, msg.chat.id);
			} else {
				var cpu = parseFloat(stdout);
				reply = "CPU Load: " + cpu + "%";
				console.log(msg.chat.id);
				send(reply, msg.chat.id);
			}
		});
	}
});

bot.onText(/^\/myid$/, function(msg, match){
	send("Your unique ID is: "+msg.chat.id, msg.chat.id);
  send("Insert this in 'my-telegram-id' in your bot.js", msg.chat.id);
});

/* SEND FUNCTION */
function send(msg, id){
	console.log(id);
	bot.sendMessage(id, msg).then(function () {
			console.log(msg);
		});
}
