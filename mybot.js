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
const moment = require('moment');
var json = require("jsonfile")

// Local data
var util = require("../akira/utilities.js")
let items = require('./Storage/items.json');
var inventory = json.readFileSync('../data/inventory.json');

// Role for cheating money
const modRole = '🍬 Admin';

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
      //----------------------------------------------------------------------------
     //----------------    SHOP YAY         ---------------------------------------
    //----------------------------------------------------------------------------    
        var shopchat = client.channels.find("name", "shop");
        if(message.channel == shopchat){ //ONLY WORKS IN THE SHOP
             if(message.content.startsWith(prefix)){
                 
			switch(cont[0].toLowerCase()){
				case "buy":
				case "shop":
                    message.delete([1])
					let categories = [];
					if (!args.join(" ")) {
						for (var i in items) {
							if (!categories.includes(items[i].type)) {
								categories.push(items[i].type)
							}
						}
// I deleted something in this section that was giving me bunch of error but after deleting one still stayd pls look at the original
						const embed = new Discord.MessageEmbed()
						.setDescription(`Available Items`)
						.setColor(0xD4AF37)

						for (var i = 0; i < categories.length; i++) {
							var tempDesc = '';
							for (var c in items) {
								if (categories[i] === items[c].type) {
									tempDesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`;
								}
							}
							embed.addField(categories[i], tempDesc);
						}
						return ;
					}

					let itemName = '';
					let itemPrice = 0;
					let itemDesc = '';
					let item;
					if(args[0]){
						for (var i in items) {
							if (args.join(" ").trim().toLowerCase() === items[i].name.toLowerCase()) {
								itemName = items[i].name;
								itemPrice = items[i].price;
								itemDesc = items[i].desc;
								itemType = items[i].type;
								item = items[i]
							}
						}

						if (itemName === '') {
							return message.author.send({embed: {
								color: 0,
								fields: [{
									name: "Fandom Circle - Shop",
									value: `**Item ${args.join(" ").trim()} not found.**`
								}]
							}})
						}

						var user = profile[message.author.id];
						if (user.money < itemPrice) {
							return message.author.send({embed: {
								color: 16727113,
								fields: [{
									name: "Fandom Circle - Shop",
									value: `**You don't have enough money for this item.**`
								}]
							}});
						}
						switch(itemType){
							case "Packs":
								profile[message.author.id].money += -itemPrice;
								message.member.addRole(message.guild.roles.find("name", item.role));
								message.author.send('**You bought ' + itemName + '!**');
								message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete({"reason":"New channel ping"}))
								break;

							case "Utilities":
								switch(itemName){
									case "Nickname Change":
										profile[message.author.id].money += -itemPrice;
										message.member.addRole(message.guild.roles.find("name", item.role),"Purchase from the shop");
										message.author.send('**You bought ' + itemName + '!**');
										message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete({"reason":"New channel ping"}))
										util.save(profile,"exp");
										break;

									case "Background":
										message.author.send("Write the code of the desired background (You can see them here https://www.fandomcircle.com/shop-1#PROFILES)").then(proposal => {
											const collector = message.channel.createMessageCollector(
												m => m.author.id == message.author.id,
												{ max: 1 }
											);
											collector.on('collect', m => {
												var unavailable = json.readFileSync('../data/unavailable.json');
												var number = m.content.split(" ")[0].toUpperCase();

												if(fs.existsSync(`../akira/images/backgrounds/${number}.png`) && !unavailable[number]){
													if(inventory[m.author.id][`bg${number}`]){
														message.author.send("You already have this background. Set it using >background <code>")
				// Somewhere here is another error with missing role or sum
                                                    }else{
														profile[m.author.id].money += -itemPrice;
														inventory[m.author.id][`bg${number}`] = true;
														message.author.send("Thanks for buying this background ^.^. Set it using >background <code>");
														util.save(inventory,"inventory");
														util.save(profile,"exp");
													}
												}else{
													message.author.send(`The background code ${number} doesnt exist or is no longer available for purchase. Check https://www.fandomcircle.com/shop-1#PROFILES for more info`)
												}
											})
										})
										break;
								}
								break;
					
                        }
                        
					
                    }
                    
					break;
         }    
            
        }      
        message.delete() //deletes messages in the shop thingy
        }
      //--------------------------------------------------------------------------------------------------------        
     //----------------------- add money cmd  -----------------------------------------------        
    //--------------------------------------------------------------------------------------------------------   
            if(message.content.startsWith(prefix)){
			switch(cont[0].toLowerCase()){
                    //--------------------------------------------------------------------------------------------------------
				case "addmoney":
					if (!message.member.roles.find("name", modRole)) {
						message.channel.send({embed: {
							color: 10181046,
							author: {
								name: message.author.username,
								icon_url: message.author.avatarURL()
							},
							fields: [{
								name: "Add Money",
								value: '**You need the role `' + modRole + '` to use this command...**'
							}]
						}})
						return;
					}

					if (!args[0]) {
						message.channel.send({embed: {
							color: 10181046,
							author: {
								name: message.author.username,
								icon_url: message.author.avatarURL()
							},

							fields: [{
								name: "Add Money",
								value: `**You need to define an amount. Usage: ${prefix}BALSET <amount> <user>**`
							}]
						}})
						return;
					}

					if (isNaN(args[0])) {
						message.channel.send({embed: {
							color: 10181046,
							author: {
								name: message.author.username,
								icon_url: message.author.avatarURL()
							},

							fields: [{
								name: "Add Money",
								value: `**The amount has to be a number. Usage: ${prefix}BALSET <amount> <user>**`
							}]
						}});
						return;
					}

					let defineduser = '';
					if (!args[1]) {
						defineduser = message.author.id;
					} else {
						let firstMentioned = message.mentions.users.first();
						defineduser = firstMentioned.id;
					}

					profile[defineduser].money += parseInt(args[0])
					util.save(profile,"exp");
					message.channel.send(`**User defined had ${args[0]} added/subtraction from their account.**`)
					break;
   //---------------------------------------------------------
                    
               //---------------------------------------------------------------------           
               //------------------------ ACCOUNT N STUFF IDK  ---------------------------                                                                            //---------------------------------------------------------------------
				case "balance":
				case "money":
                //XXXXXXXX BALANCE FOR STAFF MEMBERS------ 
                    if (message.member.roles.find("name", "Staff Team")) {
					message.channel.send(   
                        {embed: {
                        title: `**Account Balance:** ${profile[message.author.id].money} 💴`,    
						color: 16723473,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/nIiVFxH.png",
                        text: "Fandom Bank (Staff Member 🔰)",
                                        }  ,  
						author: {
							name: message.author.username + " 🔰",
							icon_url: message.author.avatarURL(),
						},
					}})
                    }
            //XXXXXXXX BALANCE FOR PATRONS------      
                   else if (message.member.roles.find("name", "✨ Patreons")) {
					message.channel.send(   
                        {embed: {
                        title: `**Account Balance:** ${profile[message.author.id].money} 💴`,    
						color: 16766720,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/e6GVMzo.png",
                        text: "Fandom Bank (Patron ✨)",
                                        }  ,  
						author: {
							name: message.author.username + " ✨",
							icon_url: message.author.avatarURL(),
						},
					}})
                    }
            //XXXXXXXX BALANCE FOR VETERANS------         
                  else if (message.member.roles.find("name", "🍙 - Veterans")) {
					message.channel.send(   
                        {embed: {
                        title: `**Account Balance:** ${profile[message.author.id].money} 💴`,    
						color: 6384383,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/h0UM6Nj.png",
                        text: "Fandom Bank (Veteran 🍙)",
                                        }  ,  
						author: {
							name: message.author.username + " 🍙",
							icon_url: message.author.avatarURL(),
						},
					}})
                    }
            //XXXXXXXX BALANCE FOR MEMBERS------       
                            
                else if (message.member.roles.find("name", "🍧 - Members")) {
					message.channel.send(   
                        {embed: {
                        title: `**Account Balance:** ${profile[message.author.id].money} 💴`,    
						color: 16723473,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/0df5BYX.png",
                        text: "Fandom Bank (Member 🍧)",
                                        }  ,  
						author: {
							name: message.author.username + " 🍧",
							icon_url: message.author.avatarURL(),
						},
					}})
                    }    
      //XXXXXXXX BALANCE FOR CUSTOMERS------         
                            
                else if (message.member.roles.find("name", "☕ - Customers")) {
					message.channel.send(   
                        {embed: {
                        title: `**Account Balance:** ${profile[message.author.id].money} 💴`,    
						color: 14246399,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/T6XEiI2.png",
                        text: "Fandom Bank (Customer ☕)",
                                        }  ,  
						author: {
							name: message.author.username + " ☕",
							icon_url: message.author.avatarURL(),
						},
					}})
                    } 
                    
                    
        //------------------------------------------------------------------------------------                  
                    
                    
                    else {    
                        message.channel.send(`**You are missing a role - please contact the staff**`)};
					break;
             //-----------------------------------------------------------------------------                                                                     //------------------------------------- DAILYS --------------------------------   

          //------------------ POSIBLY BROKEN BUT IAM PRETTY SURE ITS JUST -----------------  
         //----------------------- THERE ISNT NO ELSE FOR NO ROLE THUS ITS WEIRD -----------
              
				case "daily":
					if(profile[message.author.id].lastDaily == "Not Collected" || moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours() >= 24){
						profile[message.author.id].lastDaily = moment().format("YYYY-MM-DD kk:mm");
						profile[message.author.id].money += 500;
						util.save(profile,"exp");              
           
                  //XXXXXXXX BALANCE FOR STAFF MEMBERS------          
                  //XXXXXXXX DAILY WORKED   ------       
                        
                    if (message.member.roles.find("name", "Staff Team")) {
					message.channel.send(   
                        {embed: {   
						color: 0,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/nIiVFxH.png",
                        text: "Fandom Bank (Staff Member 🔰)",
                                        }  ,  
						author: {
							name: message.author.username + " 🔰",
							icon_url: message.author.avatarURL(),
                            
						},
                        fields: [{
								name: "Daily collection",
								value: `**You got $500! New Balance:** ${profile[message.author.id].money}`
							}]
					}})
                    }
                  //XXXXXXXX BALANCE FOR PATRONS-----          
                  //XXXXXXXX DAILY WORKED   ------        
                   else if (message.member.roles.find("name", "✨ Patreons")) {
					message.channel.send(   
                        {embed: { 
                        title: `**You got $500! New Balance:** ${profile[message.author.id].money}`,   
						color: 3446302,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/Dmvr5Aa.png",
                        text: "Fandom Bank (Patron ✨)",
                                        }  ,  
						author: {
							name: message.author.username + " ✨",
							icon_url: message.author.avatarURL(),
						},   
					}})
                    }
                  //XXXXXXXX BALANCE FOR VETERANS------          
                  //XXXXXXXX DAILY WORKED   ------         
                  else if (message.member.roles.find("name", "🍙 - Veterans")) {
					message.channel.send(   
                        {embed: {
                        title: `**You got $500! New Balance:** ${profile[message.author.id].money}`,     
						color: 3446302,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/Dmvr5Aa.png",
                        text: "Fandom Bank (Veteran 🍙)",
                                        }  ,  
						author: {
							name: message.author.username + " 🍙",
							icon_url: message.author.avatarURL(),
					},                            
					}})
                    }
                  //XXXXXXXX BALANCE FOR MEMBERS------          
                  //XXXXXXXX DAILY WORKED   ------        
                            
                else if (message.member.roles.find("name", "🍧 - Members")) {
					message.channel.send(   
                        {embed: { 
                        title: `**You got $500! New Balance:** ${profile[message.author.id].money}`,      
						color: 3446302,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/Dmvr5Aa.png",
                        text: "Fandom Bank (Member 🍧)",
                                        }  ,  
						author: {
							name: message.author.username + " 🍧",
							icon_url: message.author.avatarURL(),
						},
                        }})
                    }    
                  //XXXXXXXX BALANCE FOR STAFF CUSTOMERS-----          
                  //XXXXXXXX DAILY WORKED   ------         
                            
                else if (message.member.roles.find("name", "☕ - Customers")) {
					message.channel.send(   
                        {embed: {
                        title: `**You got $500! New Balance:** ${profile[message.author.id].money}`,
						color: 3446302,
                        timestamp: message.createdTimestamp, 
                        footer: {
                       icon_url: "https://i.imgur.com/Dmvr5Aa.png",
                        text: "Fandom Bank (Customer ☕)",
                                        }  ,  
						author: {
							name: message.author.username + " ☕",
							icon_url: message.author.avatarURL(),
						},
					}})
                       }else {message.channel.send(`**You are missing a role - please contact the staff**`)};   //MISING A ROLE THINGY ADDED BUT STILL WEIRD ERRORS 
                        
					}else{                                                                   
            //-----------------------------------------------------------------------------
                  
                        //XXXXXXXX BALANCE FOR STAFF TEAM-----          
                        //XXXXXXXX DAILY DIDNT   ------     
                        
                        if (message.member.roles.find("name", "Staff Team")) {
					message.channel.send(   
                        {embed: { 
                        title: `**You already collected your daily reward! Collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`,     
						color: 5198940,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/ZmY9zyV.png",
                        text: "Fandom Bank (Staff Member 🔰)",
                                        }  ,  
						author: {
							name: message.author.username + " 🔰",
							icon_url: message.author.avatarURL(),
                            
						},
					}})
                    }
                        //XXXXXXXX BALANCE FOR PATRONS-----          
                        //XXXXXXXX DAILY DIDNT   ------        
                   else if (message.member.roles.find("name", "✨ Patreons")) {
					message.channel.send(   
                        {embed: { 
                           title: `**You already collected your daily reward! Collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`,     
						color: 5198940,
                        timestamp: message.createdTimestamp, 
                        footer: {
                       icon_url: "https://i.imgur.com/ZmY9zyV.png",
                        text: "Fandom Bank (Patron ✨)",
                                        }  ,  
						author: {
							name: message.author.username + " ✨",
		            icon_url: "https://i.imgur.com/ZmY9zyV.png",
						},  
					}})
                    }
                        //XXXXXXXX BALANCE FOR VETERANS-----          
                        //XXXXXXXX DAILY DIDNT   ------          
                  else if (message.member.roles.find("name", "🍙 - Veterans")) {
					message.channel.send(   
                        {embed: { 
                           title: `**You already collected your daily reward! Collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`,       
						color: 5198940,
                        timestamp: message.createdTimestamp, 
                        footer: {
                        icon_url: "https://i.imgur.com/ZmY9zyV.png",
                        text: "Fandom Bank (Veteran 🍙)",
                                        }  ,  
						author: {
							name: message.author.username + " 🍙",
							icon_url: message.author.avatarURL(),
						},                    
					}})
                    }
                        //XXXXXXXX BALANCE FOR MEMBERS-----          
                        //XXXXXXXX DAILY DIDNT   ------           
                            
                else if (message.member.roles.find("name", "🍧 - Members")) {
					message.channel.send(   
                        {embed: { 
                        title: `**You already collected your daily reward! Collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`,      
						color: 5198940,
                        timestamp: message.createdTimestamp, 
                        footer: {
                      icon_url: "https://i.imgur.com/ZmY9zyV.png",
                        text: "Fandom Bank (Member 🍧)",
                                        }  ,  
						author: {
							name: message.author.username + " 🍧",
							icon_url: message.author.avatarURL(),
						},
                        }})
                    }    
                        //XXXXXXXX BALANCE FOR CUSTOMERS-----          
                        //XXXXXXXX DAILY DIDNT   ------          
                            
                else if (message.member.roles.find("name", "☕ - Customers")) {
					message.channel.send(   
                        {embed: {
 
						color: 0,
                        timestamp: message.createdTimestamp, 
                        footer: {
                      icon_url: "https://i.imgur.com/ZmY9zyV.png",
                        text: "Fandom Bank (Customer ☕)",
                                        }  ,  
						author: {
							name: message.author.username + " ☕",
							icon_url: message.author.avatarURL(),
						},
                                                    fields: [{
								name: "Daily collection",
								value: `**You already collected your daily reward! Collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`,
							}] 
					}})
                       }else{
                           message.channel.send(`**You are missing a role - please contact the staff**`)};  
                        
                        
                        
                
					}    
					break;
			}
		}

		if (message.channel.name == "shiro") {
			util.talk(client,message);  //BMO CAN TALK O.O
		}
            
	}catch(e){
		util.log(client,e)
	}
})

//------------------------------------------------------------





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












