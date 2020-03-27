const Discord = require('discord.js');
const RemindTowerFile = './Files.test.mp3'
const Embeds = require('./embed');
var dispatcher;

module.exports = {
    cmd_remindTower(msg, args, client){
        
        if (!msg.member.voice.channel) {
            	Embeds.error('', 'You have to join an Voice Channel first');
        }else{
            msg.member.voice.channel.join().then(connection => {
                
                dispatcher = connection.play(RemindTowerFile);
                for(const connection of client.voice.connections.values()){
                    connection.play(broadcastTower);
                }

            })
        }
    }
}
