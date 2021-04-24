import * as Discord from "discord.js";
import * as https from "https";
import * as embed from "./embed";
import * as perm from "../permissions";

export function cmd_lastLaunch(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.space_launch,
			description: "Get the last 5 rocket launches.",
			args: []
		}
	}

    if (args?.length != 0) return;
    var requestObj: any;
    var requestStr = "";
    var response = "";
    https
        .get("https://spacelaunchnow.me/api/3.3.0/launch/previous/", (res) => {
            res.setEncoding("utf8");
            res.on("data", (d) => {
                requestStr += d;
            });
            res.on("end", () => {
                requestObj = JSON.parse(requestStr);
                for (var i = 0; i < 5; i++) {
                    if (i != 0) response += "\n";
                    response += "-[" + requestObj.results[i].name + " " + requestObj.results[i].net + "](" + requestObj.results[i].slug + ")";
                }
                console.log(requestObj);
                embed.message(msg?.channel, "The last five rocket launches were:\n" + response, "");
            });
        })
        .on("error", (e) => {
            console.error(e);
        });
}

export function cmd_nextLaunch(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.space_launch,
			description: "Get the next 5 rocket launches.",
			args: []
		}
	}

    if (args?.length != 0) return;
    
	var requestObj: any;
    var requestStr = "";
    var response = "";
    https
        .get("https://spacelaunchnow.me/api/3.3.0/launch/upcoming/", (res) => {
            res.setEncoding("utf8");
            res.on("data", (d) => {
                requestStr += d;
            });
            res.on("end", () => {
                requestObj = JSON.parse(requestStr);
                for (var i = 0; i < 5; i++) {
                    if (i != 0) response += "\n";
                    response += "-[" + requestObj.results[i].name + " " + requestObj.results[i].net + "](" + requestObj.results[i].slug + ")";
                }
                console.log(requestObj);
                embed.message(msg?.channel, "The nex five rocket launches are:\n" + response, "");
            });
        })
        .on("error", (e) => {
            console.error(e);
        });
}

export function cmd_lastSpaceXLaunch(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.space_launch,
			description: "Get the last 5 SpaceX launches.",
			args: []
		}
	}

    if (args?.length != 0) return;

    var requestObj: any;
    var requestStr = "";
    var response = "";
    https
        .get("https://spacelaunchnow.me/api/3.3.0/launch/previous/?search=SpaceX", (res) => {
            res.setEncoding("utf8");
            res.on("data", (d) => {
                requestStr += d;
            });
            res.on("end", () => {
                requestObj = JSON.parse(requestStr);
                for (var i = 0; i < 5; i++) {
                    if (i != 0) response += "\n";
                    response += "-[" + requestObj.results[i].name + " " + requestObj.results[i].net + "](" + requestObj.results[i].slug + ")";
                }
                console.log(requestObj);
                embed.message(msg?.channel, "The last five SpaceX launches are:\n" + response, "");
            });
        })
        .on("error", (e) => {
            console.error(e);
        });
}

export function cmd_nextSpaceXLaunch(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.space_launch,
			description: "Get the next 5 SpaceX launches.",
			args: []
		}
	}

    if (args?.length != 0) return;

    var requestObj: any;
    var requestStr = "";
    var response = "";
    https
        .get("https://spacelaunchnow.me/api/3.3.0/launch/upcoming/?search=SpaceX", (res) => {
            res.setEncoding("utf8");
            res.on("data", (d) => {
                requestStr += d;
            });
            res.on("end", () => {
                requestObj = JSON.parse(requestStr);
                for (var i = 0; i < 5; i++) {
                    if (i != 0) response += "\n";
                    response += "-[" + requestObj.results[i].name + " " + requestObj.results[i].net + "](" + requestObj.results[i].slug + ")";
                }
                console.log(requestObj);
                embed.message(msg?.channel, "The next five SpaceX launches are:\n" + response, "");
            });
        })
        .on("error", (e) => {
            console.error(e);
        });
}
