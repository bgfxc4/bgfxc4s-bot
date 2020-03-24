const Discord = require('discord.js');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const token = 'NjkxOTc5NDkyNjYyNDQ0MDcz.Xnn2VQ.kWh9Y6RggkEA3t9LmHOnVL4I-2U';

var client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)
})

var cmdmap = {
    say: cmd_say,
    test: cmd_test
}



client.on('message', (msg) => {

    var cont = msg.content;
    var author = msg.member;
    var chan = msg.channel;
    var guil = msg.guild;

    if(author.id != client.user.id && cont.startsWith(config.prefix)){
        
        // ::say hello world!
        var invoke = cont.split(" ")[0].substring(config.prefix.length);
        var args = cont.split(" ").slice(1);

        if(invoke in cmdmap){
            cmdmap[invoke](msg, args);
        }
    }
})


function cmd_say(msg, args){
    msg.channel.send(args.join(' '));
}

function cmd_test(msg, args){
    console.log("test");
}



client.login(process.env.token);