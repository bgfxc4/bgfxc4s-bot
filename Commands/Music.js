const Discord = require('discord.js');
const RemindTowerFile = './Files.test.mp3'
var dispatcher;

module.exports = {
    cmd_remindTower(msg, args, client){
        
        if (!msg.member.voice.channel) {

        }


        dispatcher = connection.play(RemindTowerFile);
        for(const connection of client.voice.connections.values()){
            connection.play(broadcastTower);
        }
    }
}
