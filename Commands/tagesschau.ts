import * as Discord from "discord.js";
import * as https from "https";
import * as embed from "./embed";
import * as perm from "../permissions";
import * as main from "../main";

export function cmd_search(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.tagesschau,
			description: "Search for the 5 newest tagesschau articles with keywords",
			args: [
				{ name: "Keywords for the search", type: [main.args_types.text]}
			]
		}
	}

    if (args?.length == 0) return;

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

export function cmd_news(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.tagesschau,
			description: "Get the 5 newest articles",
			args: []
		}
	}

    if (args?.length != 0) return;

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
    if (jsonObject?.type == "video") {
        //return jsonObject.title + "\nhttps://www.tagesschau.de/multimedia/video/" + jsonObject.sophoraId + "~_parentId-ondemand100.html";
        return "[" + jsonObject.title + "](" + "https://www.tagesschau.de/multimedia/video/" + jsonObject.sophoraId + "~_parentId-ondemand100.html" + ")";
    } else if (jsonObject?.type == "story") {
        //return jsonObject.title + "\n" + jsonObject.detailsweb;
        return "[" + jsonObject.title + "](" + jsonObject.detailsweb + ")";
    } else {
        return jsonObject?.title;
    }
}
