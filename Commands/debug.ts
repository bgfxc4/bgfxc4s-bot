import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import * as https from "https"

export function cmd_get_pid(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "Print the pid of the current process.";
    if (modus == "get_permission") return perm.list.admin
    if (msg == undefined) return;
	if (args == undefined || args.length != 0) return embed.error(msg.channel, "You dont need to specify any arguments!", "");

	embed.message(msg.channel, `The current pid is ${process.pid}.`, "")
}

