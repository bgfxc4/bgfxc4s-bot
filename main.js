const Discord = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const token = 'NjkxOTc5NDkyNjYyNDQ0MDcz.Xnn2VQ.kWh9Y6RggkEA3t9LmHOnVL4I-2U';

var client = new Discord.Client();

var AceCount = 0;
var RageCount = 0;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)
})

var cmdmap = {
    say: cmd_say,
    test: cmd_test,
    addAce: cmd_addAce,
    minusAce: cmd_minusAce,
    ace: cmd_printAce,
    setAce: cmd_setAce,
    addRage: cmd_addRage,
    minusRage: cmd_minusRage,
    rage: cmd_printRage,
    setRage: cmd_setRage
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
        }else{
            msg.channel.send("Wrong Invoke!");
        }
    }
})


function cmd_say(msg, args){
    msg.channel.send(args.join(' '));
}

function cmd_test(msg, args){
    console.log("test");

}

function cmd_addAce(msg, args){
    AceCount ++;
    msg.channel.send("Currently there are " + AceCount + " Aces!");
}

function cmd_minusAce(msg, args){
    AceCount --;
    msg.channel.send("Currently there are " + AceCount + " Aces!");
}

function cmd_printAce(msg, args){
    msg.channel.send("Currently there are " + AceCount + " Aces!");
    console.log(AceCount);
}

function cmd_setAce(msg, args){
    AceCount = parseInt(args[0]);

    msg.channel.send("Currently there are " + AceCount + " Aces!");
}

function cmd_addRage(msg, args){
    RageCount ++;
    msg.channel.send("Currently there are " + RageCount + " Rages!");
}

function cmd_minusRage(msg, args){
    RageCount --;
    msg.channel.send("Currently there are " + RageCount + " Rages!");
}

function cmd_printRage(msg, args){
    msg.channel.send("Currently there are " + RageCount + " Rages!");
    console.log(RageCount);
}

function cmd_setRage(msg, args){
    RageCount = parseInt(args[0]);

    msg.channel.send("Currently there are " + RageCount + " Rages!");
}

client.login(process.env.token);