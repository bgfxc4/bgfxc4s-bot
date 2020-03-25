const Discord = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const token = 'NjkxOTc5NDkyNjYyNDQ0MDcz.Xnn2VQ.kWh9Y6RggkEA3t9LmHOnVL4I-2U';

var client = new Discord.Client();

var AceCount = {};
var RageCount = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)

    for(var value in AceCount) {
        value = 0;
        console.log(value);
    }
    for(var value in RageCount){
        value = 0;
        console.log(value);
    } 

})

var cmdmap = {
    help: cmd_help,
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


function cmd_help(msg, args){
    msg.channel.send("Hello, \n my Prefix is !! and my commands are: \n say, addAce, minusAce, setAce, ace, \n addRage, minusRage, setRage, rage,");
}


function cmd_say(msg, args){
    msg.channel.send(args.join(' '));
}

function cmd_test(msg, args){
    console.log("test");

}

function cmd_addAce(msg, args){
    AceCount[msg.guild.id] ++;
    msg.channel.send("Currently there are " + AceCount[msg.guild.id] + " Aces!");
}

function cmd_minusAce(msg, args){
    AceCount[msg.guild.id] --;
    msg.channel.send("Currently there are " + AceCount[msg.guild.id] + " Aces!");
}

function cmd_printAce(msg, args){
    msg.channel.send("Currently there are " + AceCount[msg.guild.id] + " Aces!");
    console.log(AceCount[msg.guild.id]);
}

function cmd_setAce(msg, args){
    AceCount[msg.guild.id] = parseInt(args[0]);

    msg.channel.send("Currently there are " + AceCount[msg.guild.id] + " Aces!");
}

function cmd_addRage(msg, args){
    RageCount[msg.guild.id] ++;
    msg.channel.send("Currently there are " + RageCount[msg.guild.id] + " Rages!");
}

function cmd_minusRage(msg, args){
    RageCount[msg.guild.id] --;
    msg.channel.send("Currently there are " + RageCount[msg.guild.id] + " Rages!");
}

function cmd_printRage(msg, args){
    msg.channel.send("Currently there are " + RageCount[msg.guild.id] + " Rages!");
    console.log(RageCount[msg.guild.id]);
}

function cmd_setRage(msg, args){
    RageCount[msg.guild.id] = parseInt(args[0]);

    msg.channel.send("Currently there are " + RageCount[msg.guild.id] + " Rages!");
}

client.login(/*process.env.*/token);