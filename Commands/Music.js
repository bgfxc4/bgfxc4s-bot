const Discord = require('discord.js');
const RemindTowerFile = './Files/test.mp3'
const Embeds = require('./embed');
var dispatcher;

module.exports = {
    cmd_remindTower(msg, args, client){
        
        if (message.member.voice.channel) {
            const connection = message.member.voice.channel.join();

            dispatcher = connection.play(RemindTowerFile);

            dispatcher.on('finish', () => {
                console.log('Finished playing!');
              });
              
              dispatcher.destroy(); // end the stream
          } else {
            Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
          }
    }
}
