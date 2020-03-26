const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');

const COLORS = {
    red: 0xe74c3c,
    green: 0x2ecc71
}


module.exports = {

    error(chan, cont, title){
        var message;
        var emb = new Discord.RichEmbed()
            .setColor(COLORS.red)
            .setDescription(cont);
        if(title){
            emb.setTitle(title);
        }
        chan.send('', emb).then((m) => {
            message = m;
        });
        return message;
    },

    info(chan, cont, title){

    }


}