const ytdl = require('ytdl-core');
const Embeds = require('./embed');

module.exports = {
    async cmd_playURL(msg, args){
        if(args[0] == undefined){

            Embeds.error(msg.channel, 'Argument must be an URL', '');
            console.log(args[0] + " is not a URL");
            }else {

            let validate  = await ytdl.validateURL(args[0]);
            
            if(!validate) return Embeds.error(msg.channel, 'Please input a **valid** url following the command');
            
            let info = await ytdl.getInfo(args[0]);

              if (msg.member.voice.channel) {
                connection = msg.member.voice.channel.join().then(async (connection) => {

                let dispatcher = await connection.play(ytdl(args[0]), {filter : 'audioonly'});
                
                Embeds.info(msg.channel, `Now playing: ${info.title}`, '');

              });
              } else {
                Embeds.error(msg.channel, 'You need to join a voice channel first!', '');
              }
            }
    }
}