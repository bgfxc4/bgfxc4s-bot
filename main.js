const Discord = require("discord.js");
const fs = require("fs");
const { log } = require("util");
const { error } = require("console");

const embed = require("./Commands/embed.js");
const tagesschau = require("./Commands/tagesschau.js");

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

var client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}...`);
});

var cmdmap = {
  help: cmd_help,
  tagesschau_search: tagesschau.cmd_search,
  tagesschau_news: tagesschau.cmd_news,
};

client.on("message", (msg) => {
  if (!msg.guild) return;

  var cont = msg.content;
  var author = msg.member;
  var chan = msg.channel;
  var guil = msg.guild;

  try {
    if (author.id != null && client.user.id != null) {
      if (author.id != client.user.id && cont.startsWith(config.prefix)) {
        // ::say hello world!
        var invoke = cont.split(" ")[0].substring(config.prefix.length);
        var args = cont.split(" ").slice(1);

        if (invoke in cmdmap) {
          cmdmap[invoke](msg, args);
        } else {
          embed.error(msg.channel, "Wrong Invoke!", "");
        }
      }
    }
  } catch (err) {
    catch_err(err, msg);
  }
});

function catch_err(err, msg) {
  embed.error(msg.channel, err, "Error");
  console.log("ERROR: " + err);
}

function cmd_help(msg, args, modus) {
  if (modus == "get_description") return "get a list of all commands";
  if (args.length != 0) return embed.error(msg.channel, "This command doesnt need any arguments!", "");

  var help_msgs = Object.keys(cmdmap);
  var help_msg = "";
  for (var i = 0; i < help_msgs.length; i++) {
    if (i != 0) help_msg += "\n";
    help_msg += help_msgs[i] + ": " + cmdmap[help_msgs[i]](undefined, undefined, "get_description");
  }
  embed.message(msg.channel, help_msg, "");
}

client.login(config.token);
