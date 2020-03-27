const Discord = require('discord.js');
const fs = require('fs');
const Embeds = require('./Commands/embed');
const RageAndAce = require ('./Commands/RageAndAce');
const Music = require('./Commands/Music');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`);


})

var cmdmap = {
    help: cmd_help,
    say: cmd_say,
    test: cmd_test,
    addAce: RageAndAce.cmd_addAce,
    minusAce: RageAndAce.cmd_minusAce,
    ace: RageAndAce.cmd_printAce,
    setAce: RageAndAce.cmd_setAce,
    addRage: RageAndAce.cmd_addRage,
    minusRage: RageAndAce.cmd_minusRage,
    rage: RageAndAce.cmd_printRage,
    setRage: RageAndAce.cmd_setRage,
    remindTower: Music.cmd_remindTower
}



client.on('message', (msg) => {

    if (!msg.guild) return;

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


function catchErr(err, message){/*
    client.users.get("581755729791418380").send("There was an error at channel " + message.channel + " in guild " + message.guild);
    client.users.get("581755729791418380").send("ERROR ```" + err + "```");*/
    console.log("Error(own): " + err);

}

client.login(config.token);