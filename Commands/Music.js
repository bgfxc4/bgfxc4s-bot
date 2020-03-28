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

    async cmd_playRemindTower(msg, args, client){
      let voice_channel = msg.member.voice.channel;
      let connection = await voice_channel.join()
      const dispatcher = connection.play(RemindTowerFile)
                  .on("end",()=>{
                      console.log("Music Ended")
                      voice_channel.leave()
                  })
                  .on("error",error=>{console.error(error)});
    }
    
}
