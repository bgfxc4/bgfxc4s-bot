const Discord = require('discord.js');
const RemindTowerFile = '/test.mp3';
const Embeds = require('./embed');
var dispatcher;
var channel = {};

module.exports = {
    cmd_join(msg, args){
        
        if (msg.member.voice.channel) {
            channel[msg.guild.id] = msg.member.voice.channel.join().then(connection => {
              channel[msg.guild.id].play(RemindTowerFile);
              console.log("playing")
              console.log(channel[msg.guild.id].status);
            });
/*
            dispatcher = connection.play(RemindTowerFile);

            dispatcher.on('finish', () => {
                console.log('Finished playing!');
              });
              
              dispatcher.destroy(); // end the stream*/
          } else {
            Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
          }
    },

    cmd_leave(msg, args){
      msg.member.voice.channel.leave();
    },

    async cmd_playRemindTower(msg, args){
      if(!channel[msg.guild.id]) {
        Embeds.error(msg.channel, 'The bot is currently not in a Channel, use !!join!');
        return;
      }
      channel[msg.guild.id].play(RemindTowerFile);

    }
    
}
