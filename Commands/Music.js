const Discord = require('discord.js');
const RemindTowerFile = '/Files/test.mp3'
const Embeds = require('./embed');
var dispatcher;
var connection;

module.exports = {
    cmd_join(msg, args, client){
        
        if (msg.member.voice.channel) {
            connection = msg.member.voice.channel.join().then(connection => {
              connection.play('./Files/test.mp3');
              console.log("playing")
              console.log(connection.status);
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

    cmd_leave(msg, args, client){
      msg.member.voice.channel.leave();
    },

    cmd_playRemindTower(msg, args, client){
        if(connection == 'undefined') return;

        dispatcher = connection.play(RemindTowerFile);
    }
    
}
