const Discord = require("discord.js");
const https = require("https");
const embed = require("./embed.js");

module.exports = {
  cmd_search(msg, args, modus) {
    if (modus == "get_description") return "search for the newest tagesschau article with keywords";
    if (args.length == 0) return embed.error(msg.channel, "You need to specify at least one keyword", "");
    var requestObj;
    https
      .get("https://www.tagesschau.de/api2/search/?searchText=" + args.join(" ") + "&pageSize=1", (res) => {
        res.setEncoding("utf8");
        res.on("data", (d) => {
          //console.log(d);
          requestObj = JSON.parse(d);
          console.log(requestObj);
          if (requestObj.searchResults[0].type == "video") {
            embed.message(msg.channel, requestObj.searchResults[0].title + "\nhttps://www.tagesschau.de/multimedia/video/" + requestObj.searchResults[0].sophoraId + "~_parentId-ondemand100.html", "");
          } else if (requestObj.searchResults[0].type == "story") {
            embed.message(msg.channel, requestObj.searchResults[0].title + "\n" + requestObj.searchResults[0].detailsweb, "");
          } else {
            embed.message(msg.channel, requestObj.searchResults[0].title, "");
          }
        });
      })
      .on("error", (e) => {
        console.error(e);
      });
  },
};
