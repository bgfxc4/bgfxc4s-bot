import * as Discord from "discord.js";
import * as https from "https";
import * as embed from "./embed";
import * as perm from "../permissions";

export function cmd_search(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_permission") return perm.list.tagesschau;
    if (modus == "get_description") return "[keywords] search for the 5 newest tagesschau articles with keywords";
    if (args?.length == 0) return embed.error(msg?.channel, "You need to specify at least one keyword!", "");
    var requestObj: any;
    var requestStr = "";
    https
        .get("https://www.tagesschau.de/api2/search/?searchText=" + args?.join(" ") + "&pageSize=5", (res) => {
            res.setEncoding("utf8");
            res.on("data", (d) => {
                requestStr += d;
            });
            res.on("end", () => {
                requestObj = JSON.parse(requestStr);
                var str = "";
                for (var i = 0; i < 5; i++) {
                    if (i != 0) str += "\n\n";
                    str += i + 1 + ". " + get_string_to_article(requestObj.searchResults[i]);
                }
                embed.message(msg?.channel, str, "");
            });
        })
        .on("error", (e) => {
            console.error(e);
        });
}

export function cmd_news(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_permission") return perm.list.tagesschau;
    if (modus == "get_description") return "get the 5 newest articles";
    if (args?.length != 0) return embed.error(msg?.channel, "This command doesnt need a argument!", "");
    var requestObj: any;
    var requestStr = "";
    https
        .get("https://www.tagesschau.de/api2/news/", (res) => {
            res.setEncoding("utf8");
            res.on("data", (d) => {
                requestStr += d;
            });
            res.on("end", () => {
                requestObj = JSON.parse(requestStr);
                var str = "";
                for (var i = 0; i < 5; i++) {
                    if (i != 0) str += "\n\n";
                    str += i + 1 + ". " + get_string_to_article(requestObj.news[i]);
                }
                embed.message(msg?.channel, str, "");
            });
        })
        .on("error", (e: Error) => {
            console.error(e);
        });
}

function get_string_to_article(jsonObject: any) {
    if (jsonObject.type == "video") {
        //return jsonObject.title + "\nhttps://www.tagesschau.de/multimedia/video/" + jsonObject.sophoraId + "~_parentId-ondemand100.html";
        return "[" + jsonObject.title + "](" + "https://www.tagesschau.de/multimedia/video/" + jsonObject.sophoraId + "~_parentId-ondemand100.html" + ")";
    } else if (jsonObject.type == "story") {
        //return jsonObject.title + "\n" + jsonObject.detailsweb;
        return "[" + jsonObject.title + "](" + jsonObject.detailsweb + ")";
    } else {
        return jsonObject.title;
    }
}
