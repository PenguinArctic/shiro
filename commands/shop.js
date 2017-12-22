const Discord = require('discord.js');
var path = require("path")
var util = require("../../akira/utilities.js")
let items = require('../Storage/items.json');
var json = require("jsonfile")
const fs = require('fs'); 

module.exports = {
    desc:"This is a description",
    execute(client, message, param){
        message.delete();

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
                                const collector = proposal.channel.createMessageCollector(
                                    m => m.author.id == message.author.id,
                                    { max: 1 }
                                );
                                collector.on('collect', m => {
                                    var unavailable = json.readFileSync('../../data/unavailable.json');
                                    var number = m.content.split(" ")[0].toUpperCase();

                                    if(fs.existsSync(`../../akira/images/backgrounds/${number}.png`) && !unavailable[number]){
                                        if(inventory[m.author.id][`bg${number}`]){
                                            message.author.send("You already have this background. Set it using >background <code>")
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
        
    }
}