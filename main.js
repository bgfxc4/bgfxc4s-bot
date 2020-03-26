const Discord = require('discord.js');
const fs = require('fs');
const Embeds = require('./embed');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var client = new Discord.Client();

var AceCount = {};
var RageCount = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`);


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

    try{

        if(author.id != null && client.user.id != null){

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
        }
    }   
    catch(err){
        catchErr(err, msg);
    }
})


function cmd_help(msg, args){
    Embeds.info(msg.channel, "Hello, \n my Prefix is !! and my commands are: \n say, addAce, minusAce, setAce, ace, \n addRage, minusRage, setRage, rage,", '');
    //msg.channel.send();
}


function cmd_say(msg, args){
    msg.channel.send(args.join(' '));
    
    msg.delete()
  .then(msg => console.log(`Deleted message from ${msg.author.username}`))
  .catch(console.error);
}

function cmd_test(msg, args){
    console.log("test");
    Embeds.info(msg.channel, "This is an test", '');
}

function cmd_addAce(msg, args){
    if(! AceCount[msg.guild.id]){
        AceCount[msg.guild.id] = 0;
    } 
    AceCount[msg.guild.id] ++;
    Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '')
}

function cmd_minusAce(msg, args){
    if(! AceCount[msg.guild.id]){
        AceCount[msg.guild.id] = 0;
    } 
    if(AceCount[msg.guild.id] >= 1){
        AceCount[msg.guild.id] --;
        Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '')
    }else{
        Embeds.error(msg.channel, "The Ace Counter is already at 0", '');
    }
}

function cmd_printAce(msg, args){
    if(! AceCount[msg.guild.id]){
        AceCount[msg.guild.id] = 0;
    } 
    Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '')
    console.log(AceCount[msg.guild.id]);
}

function cmd_setAce(msg, args){
    if(parseInt(args[0]) >= 0){
        AceCount[msg.guild.id] = parseInt(args[0]);

        Embeds.info(msg.channel, "Currently there are " + AceCount[msg.guild.id] + " Aces!", '');
    }else{
        Embeds.error(msg.channel, "The Ace Counter can't be negativ!", '');
    }
}

function cmd_addRage(msg, args){
    if(! RageCount[msg.guild.id]){
        RageCount[msg.guild.id] = 0;
    } 
    RageCount[msg.guild.id] ++;
    Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '');
}

function cmd_minusRage(msg, args){
    if(! RageCount[msg.guild.id]){
        RageCount[msg.guild.id] = 0;
    } 
    if(RageCount[msg.guild.id] >= 1){
        RageCount[msg.guild.id] --;
        Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '')
    }else{
        Embeds.error(msg.channel, "The Rage Counter is already at 0", '');
    }
}

function cmd_printRage(msg, args){
    if(! RageCount[msg.guild.id]){
        RageCount[msg.guild.id] = 0;
    } 
    Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '');
    console.log(RageCount[msg.guild.id]);
}

function cmd_setRage(msg, args){
    if(parseInt(args[0]) >= 0){
        RageCount[msg.guild.id] = parseInt(args[0]);

        Embeds.info(msg.channel, "Currently there are " + RageCount[msg.guild.id] + " Rages!", '');
    }else{
        Embeds.error(msg.channel, "The Rage Counter can't be negativ!", '');
    }
}

function catchErr(err, message){/*
    client.users.get("581755729791418380").send("There was an error at channel " + message.channel + " in guild " + message.guild);
    client.users.get("581755729791418380").send("ERROR ```" + err + "```");*/
    console.log("Error(own): " + err);

}

client.login(config.token);