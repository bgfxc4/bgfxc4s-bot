const Embeds = require('./embed');

var AceCount = {};
var RageCount = {};
module.exports = {

    
     cmd_addAce(msg, args){
        if(! AceCount[msg.guild.id]){
            AceCount[msg.guild.id] = 0;
        } 
        AceCount[msg.guild.id] ++;
        Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '')
    },

     cmd_minusAce(msg, args){
        if(! AceCount[msg.guild.id]){
            AceCount[msg.guild.id] = 0;
        } 
        if(AceCount[msg.guild.id] >= 1){
            AceCount[msg.guild.id] --;
            Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '')
        }else{
            Embeds.error(msg.channel, "The Ace Counter is already at 0", '');
        }
    },

    cmd_printAce(msg, args){
        if(! AceCount[msg.guild.id]){
            AceCount[msg.guild.id] = 0;
        } 
        Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '')
        console.log(AceCount[msg.guild.id]);
    },

     cmd_setAce(msg, args){
        if(parseInt(args[0]) >= 0){
            AceCount[msg.guild.id] = parseInt(args[0]);

            Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '');
        }else{
            Embeds.error(msg.channel, "The Ace Counter can't be negativ!", '');
        }
    },

    cmd_addRage(msg, args){
        if(! RageCount[msg.guild.id]){
            RageCount[msg.guild.id] = 0;
        } 
        RageCount[msg.guild.id] ++;
        Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '');
    },

     cmd_minusRage(msg, args){
        if(! RageCount[msg.guild.id]){
            RageCount[msg.guild.id] = 0;
        } 
        if(RageCount[msg.guild.id] >= 1){
            RageCount[msg.guild.id] --;
            Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '')
        }else{
            Embeds.error(msg.channel, "The Rage Counter is already at 0", '');
        }
    },

    cmd_printRage(msg, args){
        if(! RageCount[msg.guild.id]){
            RageCount[msg.guild.id] = 0;
        } 
        Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '');
        console.log(RageCount[msg.guild.id]);
    },

    cmd_setRage(msg, args){
        if(parseInt(args[0]) >= 0){
            RageCount[msg.guild.id] = parseInt(args[0]);

            Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '');
        }else{
            Embeds.error(msg.channel, "The Rage Counter can't be negativ!", '');
        }
    }

}