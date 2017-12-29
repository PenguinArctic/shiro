const Discord = require('discord.js');
var path = require("path")
var util = require("../../akira/utilities.js")
let items = require('../Storage/items.json');
var json = require("jsonfile")
const fs = require('fs'); 

module.exports = {
    desc:"This is a description",
    alias:["buy"],
    execute(client, message, param){
        var inventory = json.readFileSync(path.resolve(__dirname + "../../../data/inventory.json"));
        var profile = json.readFileSync('../data/exp.json');

        let categories = [];
        if (!param.join(" ")) {
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
            return message.author.send(embed);
        }

        let itemName = '';
        let itemPrice = 0;
        let itemDesc = '';
        let item;
        if(param[0]){
            for (var i in items) {
                if (param.join(" ").trim().toLowerCase() === items[i].name.toLowerCase()) {
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
                        value: `**Item ${param.join(" ").trim()} not found.**`
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
                    if(!message.member.roles.exists("name",item.role)){
                        profile[message.author.id].money += -itemPrice;
                        message.member.addRole(message.guild.roles.find("name", item.role));
                        message.author.send('**You bought ' + itemName + '!**');
                        message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete({"reason":"New channel ping"}))
                    }else{
                        message.author.send('**You already have ' + itemName + '!**')
                    }
                    break;

                case "Utilities":
                    switch(itemName){
                        case "Nickname Change":
                            if(!message.member.roles.exists("name",item.role)){
                                profile[message.author.id].money += -itemPrice;
                                message.member.addRole(message.guild.roles.find("name", item.role),"Purchase from the shop");
                                message.author.send('**You bought ' + itemName + '!**');
                                message.guild.channels.find("name",item.channel).send(`<@${message.author.id}>`).then(m=>m.delete({"reason":"New channel ping"}))
                                util.save(profile,"exp");
                            }else{
                                message.author.send('**You already have a ' + itemName + ' active!**')
                            }
                            break;

                        case "Background":
                            message.author.send("Write the code of the desired background (You can see them here https://www.fandomcircle.com/shop-1#PROFILES)").then(proposal => {
                                var filter = m => m.author.id == message.author.id;
                                proposal.channel.awaitMessages(filter, { max: 1 })
                                .then(collected => {
                                    var m = collected.first();
                                    var unavailable = json.readFileSync('../data/unavailable.json').bgs;
                                    var number = m.content.split(" ")[0].toUpperCase();

                                    if(fs.existsSync(`../akira/images/backgrounds/${number}.png`) && !unavailable.includes(number)){
                                        
                                        if(inventory[m.author.id].bgs.includes(number)){
                                            m.author.send("You already have this background. Set it using >background <code>")
                                        }else{
                                            profile[m.author.id].money += -itemPrice;
                                            inventory[m.author.id].bgs.push(number);
                                            m.author.send("Thanks for buying this background ^.^. Set it using >background <code>");
                                            util.save(inventory,"inventory");
                                            util.save(profile,"exp");
                                        }
                                    }else{
                                        m.author.send(`The background code ${number} doesnt exist or is no longer available for purchase. Check https://www.fandomcircle.com/shop-1#PROFILES for more info`)
                                    }
                                })
                            })
                            break;

                        case "Badges":
                            message.author.send("Write the code of the desired badge (You can see them here https://www.fandomcircle.com/shop-1#PROFILES)").then(proposal => {
                                var filter = m => m.author.id == message.author.id;
                                proposal.channel.awaitMessages(filter, { max: 1 })
                                .then(collected => {
                                    var m = collected.first();
                                    var unavailable = json.readFileSync('../data/unavailable.json').badges;
                                    var number = m.content.toUpperCase();

                                    if(fs.existsSync(`../akira/images/badges/${number}.png`) && !unavailable.includes(number)){                              
                                        if(inventory[m.author.id].badges.includes(number)){
                                            m.author.send("You already have this badge. Set it using >equip <position> <badge>")
                                        }else{
                                            profile[m.author.id].money += -itemPrice;
                                            inventory[m.author.id].badges.push(number);
                                            m.author.send("Thanks for buying this badge ^.^. Set it using >equip <position> <badge>");
                                            util.save(inventory,"inventory");
                                            util.save(profile,"exp");
                                        }
                                    }else{
                                        m.author.send(`The badge ${number} doesnt exist or is no longer available for purchase. Check https://www.fandomcircle.com/shop-1#PROFILES for more info`)
                                    }
                                })
                            })
                            break;
                    }
                    break;
            }

        }
        
    }
}