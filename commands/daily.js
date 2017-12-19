var json = require("jsonfile")
var profile = json.readFileSync('../data/exp.json');
const moment = require('moment');

var util = require("../../akira/utilities.js")

module.exports = {
    desc:"This is a description",
    execute(client, message, param){
        var embed = {
            timestamp: message.createdTimestamp, 
            author: {
                name: message.author.displayName,
                icon_url: message.author.displayAvatarURL(),               
            }
        }

        if(profile[message.author.id].lastDaily == "Not Collected" || moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours() >= 24){
            profile[message.author.id].lastDaily = moment().format("YYYY-MM-DD kk:mm");
            profile[message.author.id].money += 500;
            util.save(profile,"exp"); 
            
            embed.fields= [{
                name: "Daily collection",
                value: `**You got $500! New Balance:** ${profile[message.author.id].money}`
            }]
            embed.color= 3446302
        }else{ 
            embed.color= 0,                                                                  
            embed.title= `**You already collected your daily reward! Collect your next reward** in ${24 - Math.floor(moment.duration(moment().diff(moment(profile[message.author.id].lastDaily,"YYYY-MM-DD kk:mm"))).asHours())} hours.`;                     
        }

        //XXXXXXXX BALANCE FOR STAFF MEMBERS------             
        if (message.member.roles.find("name", "Staff Team")) {                          
            embed.footer= {
            icon_url: "https://i.imgur.com/nIiVFxH.png",
            text: "Fandom Bank (Staff Member 🔰)",
            }
            return message.channel.send({embed:embed})                 
        }
        //XXXXXXXX BALANCE FOR PATRONS-----              
        else if (message.member.roles.find("name", "✨ Patreons")) { 
             
            
            embed.footer= {
            icon_url: "https://i.imgur.com/Dmvr5Aa.png",
            text: "Fandom Bank (Patron ✨)",
            }
            return message.channel.send({embed:embed})
        }
        //XXXXXXXX BALANCE FOR VETERANS------                 
        else if (message.member.roles.find("name", "🍙 - Veterans")) {
                
                embed.footer= {
                icon_url: "https://i.imgur.com/Dmvr5Aa.png",
                text: "Fandom Bank (Veteran 🍙)",
                }
                return message.channel.send({embed:embed})
            }
        //XXXXXXXX BALANCE FOR MEMBERS------                  
        else if (message.member.roles.find("name", "🍧 - Members")) {
                
                embed.footer= {
                icon_url: "https://i.imgur.com/Dmvr5Aa.png",
                text: "Fandom Bank (Member 🍧)",
                }
                return message.channel.send({embed:embed})
        }    
        //XXXXXXXX BALANCE FOR STAFF CUSTOMERS-----                                  
        else if (message.member.roles.find("name", "☕ - Customers")) {
            
            embed.footer= {
        icon_url: "https://i.imgur.com/Dmvr5Aa.png",
            text: "Fandom Bank (Customer ☕)",
            }
            return message.channel.send({embed:embed})
        }else {
            return message.channel.send(`**You are missing a role - please contact the staff**`)
        };
    }
}