const Discord = require('discord.js');
const RemindTowerFile = '/app/Commands/Files/test.mp3';
const JebaitedFile = '/app/Commands/Files/Jebaited.mp3';
const Embeds = require('./embed');
var dispatcher;
var connection;

module.exports = {
    cmd_join(msg, args){
        
        if (msg.member.voice.channel) {
              connection = msg.member.voice.channel.join();
          } else {
            Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
          }
    },

    cmd_leave(msg, args){
      msg.member.voice.channel.leave();
    },

    cmd_playRemindTower(msg, args){
      var volume = parseInt(args[0]);  

    
      if(args[0] == undefined){
  
        Embeds.error(msg.channel, 'Argument must be an Number', '');
        console.log(args[0] + " is not a Number");
        }else {
          if (msg.member.voice.channel) {
            connection = msg.member.voice.channel.join().then(connection => {
              connection.play(RemindTowerFile, { volume: 0.2 *( volume  / 100 )});
          });
          } else {
            Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
          }
        }
   },

   cmd_playJebaited(msg, args){
    var volume = parseInt(args[0]);  


    if(args[0] == undefined){

      Embeds.error(msg.channel, 'Argument must be an Number', '');
      console.log(args[0] + " is not a Number");
      }else {
        if (msg.member.voice.channel) {
          connection = msg.member.voice.channel.join().then(connection => {
            connection.play(JebaitedFile, { volume: 0.2 *( volume  / 100 )});
        });
        } else {
          Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
        }
      }
  },

  cmd_stopPlaying(msg, args){
    if (msg.member.voice.channel) {
      connection = msg.member.voice.channel.leave();
  } else {
    Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
  }
  }
}
