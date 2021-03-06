import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import * as main from "../main"

export function cmd_get_pid(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "Print the pid of the current process.";
    if (modus == "get_permission") return perm.list.admin
    if (msg == undefined) return;
	if (args == undefined || args.length != 0) return embed.error(msg.channel, "You dont need to specify any arguments!", "");

	embed.message(msg.channel, `The current pid is ${process.pid}.`, "")
}

export function cmd_temp_cmd(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "A temporary cmd, i.e. to cheange settings.";
    if (modus == "get_permission") return perm.list.admin
    if (msg == undefined) return;
	if (args == undefined || args.length != 0) return embed.error(msg.channel, "You dont need to specify any arguments!", "");

	var guilds = main.client.guilds.cache.array()
	for (var i in guilds) {
		if (guilds[i].id == "769609915349467177") {
			var roles = guilds[i].roles.cache.array()
			for (var j in roles) {
				if (roles[j].id == "772489754000228372") {
					roles[j].setHoist(true)
				}
			}
		}
	}
}


