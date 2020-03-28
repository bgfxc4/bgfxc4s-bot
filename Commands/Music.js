const Discord = require('discord.js');
const RemindTowerFile = '/test.mp3';
const Embeds = require('./embed');
var dispatcher;
var connection;

module.exports = {
    cmd_join(msg, args){
        
        if (msg.member.voice.channel) {
              connection = msg.member.voice.channel.join().then(connection => {
              connection.play(RemindTowerFile);
              console.log("playing")
              console.log(connection.status);
            });
          } else {
            Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
          }
    },

    cmd_leave(msg, args){
      msg.member.voice.channel.leave();
    },

    cmd_playRemindTower(msg, args){
        if (msg.member.voice.channel) {
          connection = msg.member.voice.channel.join().then(connection => {
          connection.play(RemindTowerFile);
          console.log("playing")
          console.log(connection.status);
        });
      } else {
        Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
      }
   }
}
