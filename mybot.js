const Discord = require('discord.js');
const economy = require('discord-eco-chito');
economy.start("./userData.sqlite");

const fs = require('fs'); 
const moment = require('moment');
var util = require("../akira/utilities.js")
var config = require("./Storage/config.json");

let items = JSON.parse(fs.readFileSync('Storage/items.json', 'utf8'));
var inventory = JSON.parse(fs.readFileSync('../data/inventory.json', 'utf8'));

const client = new Discord.Client();

const modRole = '🌯 Administrator';

//------------------------------------------------------------
client.on('message', message => {
	let sender = message.author
	let prefix = '>';
	let msg = message.content.toUpperCase();
	let cont = message.content.slice(prefix.length).split(" ");
	let args = cont.slice(1);

	//------------------------------------------------------------

	authoruser = message.author.id;
	economy.updateBalance(authoruser + message.guild.id, Math.floor(Math.random() * 3));
	if(inventory[authoruser] == undefined) {
		inventory[authoruser]={};
		util.save(inventory,"inventory");
	}

	if (msg.startsWith(`${prefix}BUY`) || msg.startsWith(`${prefix}SHOP`)) {
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
				if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) {
					itemName = items[i].name;
					itemPrice = items[i].price;
					itemDesc = items[i].desc;
					itemType = items[i].type;
					item = items[i]
				}
			}

			if(args[0]=="Background"){
				itemName = items["Background"].name;
				itemPrice = items["Background"].price;
				itemDesc = items["Background"].desc;
				itemType = items["Background"].type;
				item = items["Background"]
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

			economy.fetchBalance(message.author.id + message.guild.id).then((i) => {
				if (i.money <= itemPrice) {
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
						economy.updateBalance(message.author.id + message.guild.id, parseInt(`-${itemPrice}`)).then((i) => {
							message.member.addRole(message.guild.roles.find("name", item.role));
							message.channel.send('**You bought ' + itemName + '!**');
							message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete("New channel ping"))
						})
						break;

					case "Utilities":
						switch(itemName){
							case "Nickname Change":
								economy.updateBalance(message.author.id + message.guild.id, parseInt(`-${itemPrice}`)).then((i) => {
									message.member.addRole(message.guild.roles.find("name", item.role));
									message.channel.send('**You bought ' + itemName + '!**');
									message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete("New channel ping"))
								})
								break;

							case "Background":
								message.channel.send("Write the number of the desired background (You can see them here https://www.fandomcircle.com/shop-1#PROFILES)").then(proposal => {
									const collector = message.channel.createMessageCollector(
										m => m.author.id == message.author.id,
										{ max: 1 }
									);
									collector.on('collect', m => {
										var number = parseInt(m.content.split(" ")[0]);
										if(inventory[m.author.id][`bg${number}`]){
											m.reply("You already have this background. Set it using >background <number>")
										}else{
											economy.updateBalance(m.author.id + m.guild.id, parseInt(`-${itemPrice}`)).then((i) => {
												inventory[m.author.id][`bg${number}`] = true;
												m.reply("Thanks for buying this background ^.^. Set it using >background <number>");
												util.save(inventory,"inventory");
											})
										}
									})
								})
								break;
						}
						break;
				}
			})
		}
	}
	//------------------------------------------------------------
	if (msg.startsWith(`${prefix}ADDMONEY`)) {
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

		economy.updateBalance(defineduser + message.guild.id, parseInt(args[0])).then((i) => {
			message.channel.send(`**User defined had ${args[0]} added/subtraction from their account.**`)
		});
	}
	//------------------------------------------------------------

	if (msg === `${prefix}BALANCE` || msg === `${prefix}MONEY`) {
		economy.fetchBalance(message.author.id + message.guild.id).then((i) => {
			message.channel.send({embed: {
				color: 10181046,
				author: {
					name: message.author.username,
					icon_url: message.author.avatarURL
				},

				fields: [{
					name: "Money",
					value: `**Account Balance:** ${i.money}💴`
				}]
			}})

		})
	}
	//------------------------------------------------------------

	if (message.content.toUpperCase() === `${prefix}DAILY`) {
		economy.fetchBalance(message.author.id + message.guild.id).then((i) => {
			console.log(i.lastDaily);
			if(i.lastDaily == "Not Collected" || moment.duration(moment().diff(moment(i.lastDaily,"YYYY-MM-DD kk:mm"))).asHours() >= 24){
				economy.updateLastDaily(message.author.id + message.guild.id,moment().format("YYYY-MM-DD kk:mm"))

				economy.updateBalance(message.author.id + message.guild.id, 500).then((i) => {
					message.channel.send({embed: {
						color: 10181046,
						author: {
							name: message.author.username,
							icon_url: message.author.avatarURL
						},

						fields: [{
							name: "Daily collection",
							value: `**You got $500! New Balance:** ${i.money}`
						}]
					}})
				})
			}else{
				message.channel.send({embed: {
					color: 10181046,
					author: {
						name: message.author.username,
						icon_url: message.author.avatarURL
					},

					fields: [{
						name: "Daily collection",
						value: `**You already collected your daily reward! You can collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(i.lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`
					}]}
									 })
			}
		})

	}
	//--------------------------------------------------------------------
	if (message.channel.name == "shiro") {
		util.talk(client,message);
	}
})

//------------------------------------------------------------





client.login(config.token)
