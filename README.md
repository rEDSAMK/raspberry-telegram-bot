#RaspberryPi Telegram bot

This is a simple bot for Telegram to control temperatures \ CPU usage or launch commands on your RaspberryPi. Is just a simple bot base easly expandable with several new commands.

Support commands and auto-notify. When the Node.js bot will go up (example. after a RaspberryPi reboot) the bot will notify you with a message.

##Setup

1. Install dependencies with `npm install`
2. Create your personal Telegram bot following these instructions: https://core.telegram.org/bots#botfather (point 6. BotFather)
3. Replace `my-telegram-bot-token` (token var) with the authorization token returned by @BotFather
4. Replace `my-bot-name` with the name of your bot (or what do you prefere, is not so important)
5. Start your bot with `node bot` (for the first setup we will just run the server one time, after we will use PM2)
4. Search and add your bot on your Telegram web\software\app and send him the command `/myid`
5. Now get the number returned by the bot and put it in `my-telegram-id`. This is your telegram unique id used by bot for send you messages and authenticate your commands. **NOTE** Only you (authenticated by the unique id just entered) are able to send command and get notification from bot.
6. Now all is ready, you can turn of the bot and continue to the steps.

This is a brief tutorial on how let the bot start automatically on Raspi bootup.

7. Install PM2, a production process manager to keep your application alive forever. Use `sudo npm install -g pm2`
8. Start the bot with the command `pm2 start bot.js`
9. PM2 can generate and configure a startup script to keep PM2 and your processes alive at every server restart. `Use pm2 startup` for generate the script.
10. Be sure your bot is up with PM2 with `pm2 list`; you should see a row with bot.js (or something like) and status online.
11. Now use `pm2 save` for save the process list so PM2 will start the bot on Raspi restart.


##Command list

Currently supported bot commands:

- When the Node.js bot will go up (example. after a RaspberryPi reboot) the bot will notify you with a message.
- `/temp` - Check the current temperature of your RaspberryPi
- `/cpu` - Check the current CPU usage % of your RaspberryPi
- `/reboot` - Reboot your RaspberryPi
- `/temp_limit on 60` - Turn on the temperature warning limit and set threshold on 50 celsius degrees. When your RaspberryPi reach or exceeds the given threshold your bot will send you a message with a warning. **NOTE** If temperature warning is already on, you can change the current temperature limit sending again the `/temp_limit on newtemp`
- `/temp_limit off` - Turn off the temperature limit (if on).
- `/myid` - Usefull command for get your Telegram unique id for the first setup.

**NOTE**: Currently, the temperature limit will reset on 60° (default) when the Node.js bot restarts. I will implement a simple temp save soon.

##How to add your command

Just insert a new command at the end of the file in bot.js following this snippet:

```
bot.onText(/^\/mycommand$/, function (msg, match) {
	if(msg.chat.id == AUTHID){
    //insert here your command code
    send("Hello!", msg.chat.id);
	}
});
```

You have to use Javascript Regular expression (like `/^\/mycommand$/`) for parse your command and your eventually parameter. In the snippet example this regex will recognize the command `/mycommand`. Some usefull regex guide on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

Use `send(message, msg.chat.id)` inside your command code for send a message. In this case `msg.chat.id` is the id of who sent you the command.

You can use the send function outside the command snippet of code; example: `send("Hello!", AUTHID)`, `AUTHID` is the variable with your unique id. In this case the bot will send a message to you.

##Example#. How to add a number (with 2 digit) parameter

```
bot.onText(/^\/mycommand (\d{2})$/, function (msg, match) {
	if(msg.chat.id == AUTHID){
    var myParam = match[1];
    //insert here your command code
    //use myParam for something
	}
});
```

In the `match` array you will find all your parameters (ignore match[0] is the textual part of the command).

##Packages used

This bot uses `node-telegram-bot-api`. You can find the documentation on https://github.com/yagop/node-telegram-bot-api
