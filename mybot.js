const Discord = require('discord.js');
const economy = require('discord-eco');
const fs = require('fs'); 
const moment = require('moment')

let items = JSON.parse(fs.readFileSync('Storage/items.json', 'utf8'));

let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'))

const client = new Discord.Client();

const modRole = 'Senpai (Owner)';

//------------------------------------------------------------
client.on('message', message => {
    let sender = message.author
    let prefix = '>';
    let msg = message.content.toUpperCase();
    let cont = message.content.slice(prefix.length).split(" "); 
    let args = cont.slice(1); 


    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
    if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = "Not Collected";
    fs.writeFile("Storage/userData.json", JSON.stringify(userData), (err) => {
        if (err) console.error(err)
    });

    //------------------------------------------------------------

    authoruser = message.author.id;


    economy.updateBalance(authoruser + message.guild.id, Math.floor(Math.random() * 3))

    if (msg.startsWith(`${prefix}BUY`)) {
        let itemName = '';
        let itemPrice = 0;
        let itemDesc = '';
        if(args[0]){
            for (var i in items) {
                if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) {
                    itemName = items[i].name;
                    itemPrice = items[i].price;
                    itemDesc = items[i].desc;
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

                economy.updateBalance(message.author.id + message.guild.id, parseInt(`-${itemPrice}`)).then((i) => {
                    message.channel.send('**You bought ' + itemName + '!**');

                    if (itemName === 'Nichijou Pack') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫Nichijou"));
                    }
                    if (itemName === 'Maid Dragon Pack') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫Maid Dragon"));
                    }
                    if (itemName === 'LWA Pack') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫LWA"));
                    }
                    if (itemName === 'JOJO Pack') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫JOJO"));
                    }
                    if (itemName === 'Noragami Pack') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫Noragami"));
                    }
                    if (itemName === 'Gabriel dropout') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫Gabriel dropout"));
                    }
                    if (itemName === 'Monogatari Pack') {
                        message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "🎫Monogatari"));
                    }
                })
            })
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
            if (userData[sender.id + message.guild.id].lastDaily != moment().format(`L`)){
                userData[sender.id + message.guild.id].lastDaily = moment().format(`L`)

                mainuser = message.author.id;

                economy.updateBalance(mainuser + message.guild.id, 500).then((i) => {
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

                    fs.writeFile("Storage/userData.json", JSON.stringify(userData), (err) => {
                        if (err) console.error(err)
                    })
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
                        value: `**You already collected your daily reward! You can collect your next reward**` + moment().endOf(`**day**`).fromNow() + `.`
                    }]}
                                     })
            }
        }
    }
})

//------------------------------------------------------------





client.login(`Mzc4MzMwMDkwNzY3MTIyNDMy.DO-ezg.uX9iQY1c78BouhiTb9tbpXan1ew`)
