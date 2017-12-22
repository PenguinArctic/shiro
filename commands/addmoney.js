var json = require("jsonfile")
var path = require("path")
var util = require("../../akira/utilities.js")
const modRole = '🍬 Admin';

module.exports = {
    desc:"This is a description",
    execute(client, message, param){
        var profile = json.readFileSync('../data/exp.json');
        if (!message.member.roles.exists("name", modRole)) {
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

        if (!param[0]) {
            message.channel.send({embed: {
                color: 10181046,
                author: {
                    name: message.author.username,
                    icon_url: message.author.avatarURL()
                },

                fields: [{
                    name: "Add Money",
                    value: `**You need to define an amount. Usage: >BALSET <amount> <user>**`
                }]
            }})
            return;
        }

        if (isNaN(param[0])) {
            message.channel.send({embed: {
                color: 10181046,
                author: {
                    name: message.author.username,
                    icon_url: message.author.avatarURL()
                },

                fields: [{
                    name: "Add Money",
                    value: `**The amount has to be a number. Usage: >BALSET <amount> <user>**`
                }]
            }});
            return;
        }

        profile[message.author.id].money += parseInt(param[0])
        util.save(profile,"exp");
        message.channel.send(`**User defined had ${param[0]} added/subtraction from their account.**`)
    }
}