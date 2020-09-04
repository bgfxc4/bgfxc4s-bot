const { RichEmbed } = require("discord.js");
const Discord = require("discord.js");

const COLORS = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
};

module.exports = {
  error(chan, cont, title) {
    var message;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.red);
    emb.setDescription(cont);
    if (title) {
      emb.setTitle(title);
    }
    chan.send("", emb).then((m) => {
      message = m;
    });
    return message;
  },

  info(chan, cont, title) {
    var message;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.yellow);
    emb.setDescription(cont);
    if (title) {
      emb.setTitle(title);
    }
    chan.send("", emb).then((m) => {
      message = m;
    });
    return message;
  },
  message(chan, cont, title) {
    var message;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.green);
    emb.setDescription(cont);
    if (title) {
      emb.setTitle(title);
    }
    chan.send("", emb).then((m) => {
      message = m;
    });
    return message;
  },

  message_with_link(chan, label, link, title) {
    var message;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.green);
    emb.setDescription("[" + label + "](" + link + ")");
    if (title) {
      emb.setTitle(title);
    }
    chan.send("", emb).then((m) => {
      message = m;
    });
    return message;
  },
};
