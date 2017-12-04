const Discord = require('discord.js');

const fs = require('fs'); 
const moment = require('moment');
var util = require("../akira/utilities.js")
var config = require("./Storage/config.json");
var json = require("jsonfile")

let items = require('./Storage/items.json');
var inventory = json.readFileSync('../data/inventory.json');

const client = new Discord.Client();

const modRole = '🌯 Administrator';

client.on('ready', () => {
	util.log(client,'I am ready!');
});

client.on('debug',info=>{
	if(!info.startsWith("[ws]")){
		util.log(client,info);
	}
})

//------------------------------------------------------------
client.on('message', message => {
	let prefix = '>';
	let msg = message.content.toLowerCase();
	let cont = message.content.slice(prefix.length).split(" ");
	let args = cont.slice(1);

	//------------------------------------------------------------
	var profile = json.readFileSync('../data/exp.json');

	//profile[message.author.id].money += Math.floor(Math.random() * 3);
	util.save(profile,"exp");

	if(inventory[message.author.id] == undefined) {
		inventory[message.author.id]={};
		util.save(inventory,"inventory");
	}
	if(message.content.startsWith(prefix)){
		switch(cont[0].toLowerCase()){
			case "buy":
			case "shop":
				let categories = [];
				if (!args.join(" ")) {
					for (var i in items) {
						if (!categories.includes(items[i].type)) {
							categories.push(items[i].type)
						}
					}

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
					return message.channel.send({embed});
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
						return message.channel.send({embed: {
							color: 10181046,
							author: {
								name: message.author.username,
								icon_url: message.author.avatarURL
							},

							fields: [{
								name: "Shop",
								value: `**Item ${args.join(" ").trim()} not found.**`
							}]
						}})
					}

					var user = profile[message.author.id];
					if (user.money < itemPrice) {
						return message.channel.send({embed: {
							color: 10181046,
							author: {
								name: message.author.username,
								icon_url: message.author.avatarURL
							},

							fields: [{
								name: "Shop",
								value: `**You don't have enough money for this item.**`
							}]
						}});
					}

					switch(itemType){
						case "Packs":
							profile[message.author.id].money += -itemPrice;
							message.member.addRole(message.guild.roles.find("name", item.role));
							message.channel.send('**You bought ' + itemName + '!**');
							message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete({"reason":"New channel ping"}))
							break;

						case "Utilities":
							switch(itemName){
								case "Nickname Change":
									profile[message.author.id].money += -itemPrice;
									message.member.addRole(message.guild.roles.find("name", item.role),"Purchase from the shop");
									message.channel.send('**You bought ' + itemName + '!**');
									message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete({"reason":"New channel ping"}))
									util.save(profile,"exp");
									break;

								case "Background":
									message.channel.send("Write the code of the desired background (You can see them here https://www.fandomcircle.com/shop-1#PROFILES)").then(proposal => {
										const collector = message.channel.createMessageCollector(
											m => m.author.id == message.author.id,
											{ max: 1 }
										);
										collector.on('collect', m => {
											var unavailable = json.readFileSync('../data/unavailable.json');
											var number = m.content.split(" ")[0].toUpperCase();

											if(fs.existsSync(`../akira/images/backgrounds/${number}.png`) && !unavailable[number]){
												if(inventory[m.author.id][`bg${number}`]){
													m.reply("You already have this background. Set it using >background <code>")
												}else{
													profile[m.author.id].money += -itemPrice;
													inventory[m.author.id][`bg${number}`] = true;
													m.reply("Thanks for buying this background ^.^. Set it using >background <code>");
													util.save(inventory,"inventory");
													util.save(profile,"exp");
												}
											}else{
												message.channel.send(`The background code ${number} doesnt exist or is no longer available for purchase. Check https://www.fandomcircle.com/shop-1#PROFILES for more info`)
											}
										})
									})
									break;
							}
							break;
					}
				}
				break;
				//--------------------------------------------------------------------------------------------------------
			case "addmoney":
				if (!message.member.roles.find("name", modRole)) {
					message.channel.send({embed: {
						color: 10181046,
						author: {
							name: message.author.username,
							icon_url: message.author.avatarURL
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
							icon_url: message.author.avatarURL
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
							icon_url: message.author.avatarURL
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

				//--------------------------------------------------------------------------------------------------------
			case "balance":
			case "money":
				message.channel.send({embed: {
					color: 10181046,
					author: {
						name: message.author.username,
						icon_url: message.author.avatarURL
					},

					fields: [{
						name: "Money",
						value: `**Account Balance:** ${profile[message.author.id].money}💴`
					}]
				}})
				break;

			case "daily":
				if(profile[message.author.id].lastDaily == "Not Collected" || moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours() >= 24){
					profile[message.author.id].lastDaily = moment().format("YYYY-MM-DD kk:mm");
					profile[message.author.id].money += 500;
					util.save(profile,"exp");

					message.channel.send({embed: {
						color: 10181046,
						author: {
							name: message.author.username,
							icon_url: message.author.avatarURL
						},

						fields: [{
							name: "Daily collection",
							value: `**You got $500! New Balance:** ${profile[message.author.id].money}`
						}]
					}})
				}else{
					message.channel.send({embed: {
						color: 10181046,
						author: {
							name: message.author.username,
							icon_url: message.author.avatarURL
						},

						fields: [{
							name: "Daily collection",
							value: `**You already collected your daily reward! You can collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`
						}]}
										 })
				}
				break;
		}
	}

	if (message.channel.name == "shiro") {
		util.talk(client,message);
	}
})

//------------------------------------------------------------





client.login(config.token)
