/////////////////////////////////////////////////////////////////////////////
//      _______   __       __   ______          ______    ______           //  
//      /       \ /  \     /  | /      \        /      \  /      \         // 
//      $$$$$$$  |$$  \   /$$ |/$$$$$$  |      /$$$$$$  |/$$$$$$  |        //   
//      $$ |__$$ |$$$  \ /$$$ |$$ |  $$ |      $$ |  $$ |$$ \__$$/         //
//      $$    $$< $$$$  /$$$$ |$$ |  $$ |      $$ |  $$ |$$      \         //
//      $$$$$$$  |$$ $$ $$/$$ |$$ |  $$ |      $$ |  $$ | $$$$$$  |        //
//      $$ |__$$ |$$ |$$$/ $$ |$$ \__$$ |      $$ \__$$ |/  \__$$ |        //
//      $$    $$/ $$ | $/  $$ |$$    $$/       $$    $$/ $$    $$/         //
//      $$$$$$$/  $$/      $$/  $$$$$$/         $$$$$$/   $$$$$$/          //
//                                                                         //                                  
/////////////////////////////////////////////////////////////////////////////

//Happy birthday bmo - o . o -

// This is what makes bmo run!!
const Discord = require('discord.js');
const client = new Discord.Client();

// Some things bmos creator totally understands
// Stuff Bmo needs to function correctly
const fs = require('fs'); 
var json = require("jsonfile")

//load the commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
const commonCommands = fs.readdirSync('../akira/commonCommands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(file.split(".js")[0], command);
	if(command.alias){
		command.alias.forEach(alias => client.commands.set(alias, command))
	}
}
for (const file of commonCommands) {
    const command = require(`../akira/commonCommands/${file}`);
	client.commands.set(file.split(".js")[0], command);
	if(command.alias){
		command.alias.forEach(alias => client.commands.set(alias, command))
	}
}

// Local data
var util = require("../akira/utilities.js")

// On startup
client.on('ready', () => {
	util.log(client,'I am ready!');
    client.user.setPresence({game: {name: "with my code", type: 1}});
    
});

// debug whatever that does
// If an error pops up, tell the creator!
client.on('debug',info=>{
	if(typeof info === 'string' && !info.startsWith("[ws]")){
		util.log(client,info);
	}
})   

//------------------------------------------------------------
//---------------- COMMANDS N STUFF --------------------------
//------------------------------------------------------------
client.on('message', message => {
    try{
		let prefix = '>';
		let msg = message.content.toLowerCase();
		let cont = message.content.slice(prefix.length).split(" ");
		let args = cont.slice(1);

		util.userCheck(message.author.id,client);
     //------------------ MONEY GIVEN PER MESSAGE ----------
		var profile = json.readFileSync('../data/exp.json');
		profile[message.author.id].money += Math.floor(Math.random() * 3);
		util.save(profile,"exp");
		
		if(message.content.startsWith(prefix) || message.content.startsWith("<@!" + client.user.id + ">")){
			var param = message.content.split(" ");
		
			if(message.content.startsWith(prefix)){
				param[0] = param[0].split(prefix)[1];
			}else{
				param.splice(0,1);
			}

			if(util.permCheck(message,param[0].toLowerCase())){
				if (client.commands.has(param[0].toLowerCase())){				
					client.commands.get(param[0].toLowerCase()).execute(client, message, args)
				}
			}
		}

        switch(message.channel.name){
			case "shiro":
				util.talk(client,message);  //BMO CAN TALK O.O
				break;
            case "shop":
                message.delete();
                break;
		}
	}catch(e){
		util.log(client,`${e}\nSource: ${__filename.split("/root/bots/")[1]}`);
	}
})

client.login(require("../data/tokens.json").shiro)

//---------------------------------
// ░▄░░░░█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█░░░░░░
// ░█░░░░█░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░█░░░░▄░
// ░█░░░░█░█░░░░░░░░░░░░░░█░█░░░░█░
// ░█░░░░█░█░░░▀░░░░░░▀░░░█░█░░░░█░
// ░▀█░░░█░█░░░░▄▄▄▄▄▄░░░░█░█░░░░█░
// ░░█▄░░█░█░░░░█▄░░▄█░░░░█░█░░▄█▀░
// ░░░▀█░█░█░░░░░▀▀▀▀░░░░░█░█▄█▀░░░
// ░░░░░▀█░▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀░█▀░░░░░
// ░░░░░░█░████████░░░▄░░▀░░█░░░░░░
// ░░░░░░█░░░▄░░░░░░▄███▄░░░█░░░░░░
// ░░░░░░█░▄▄█▄▄░░░░░░░░░▄▄░█░░░░░░
// ░░░░░░█░░░█░░░░░░░░░▄░▀▀░█░░░░░░
// ░░░░░░█░░░░░░░░░░░▄███▄░░█░░░░░░
// ░░░░░░█░███░███░░░░▀█▀░░░█░░░░░░
// ░░░░░░█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█░░░░░░
// ░░░░░░░░░░░░█░░░░░░█░░░░░░░░░░░░
//    ITS YOUR FRIEND BMO!!!
//       You can do it!!!
//      belive in yourself!!!
//---------------------------------