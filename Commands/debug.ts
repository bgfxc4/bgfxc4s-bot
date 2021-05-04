import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import * as main from "../main"

export function cmd_get_pid(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.admin,
			description: "Print the pid of the current process.",
			args: []
		}
	}

    if (msg == undefined) return;
	if (args == undefined || args.length != 0) return embed.error(msg.channel, "You dont need to specify any arguments!", "");

	embed.message(msg.channel, `The current pid is ${process.pid}.`, "");
}

export function cmd_eval(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.admin,
			description: "Eval some code, only for the admin.",
			args: [
				{ name: "Code to eval", type: [main.args_types.text_with_spaces]}
			]
		}
	}

    if (msg == undefined || args == undefined || main.client.user == null) return;
	
	eval(args.join(' '));
}

export function cmd_register_commands_guild(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.admin,
			description: "Register all / commands, but only for this guild",
			args: []
		}
	}

    if (msg == undefined) return;
	
	for (var cmd_group of main.cmdmap) {
		for (var cmd of cmd_group.commands) {
			main.client.api.applications(main.client.user.id).guilds('guild id').commands.post({data: {
				name: 'ping',
				description: 'ping pong!'
			}})
		}
	}
}

export function cmd_temp_cmd(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.admin,
			description: "A temporary cmd, i.e. to change settings.",
			args: []
		}
	}

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


