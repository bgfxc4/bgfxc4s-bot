import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import * as main from "../main"

export function cmd_move_all_to_other_channel(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.manage_channels,
			description: "Move all users from the Source Channel to the Destination Channel.",
			args: [
				{ name: "Id of Source Channel or Source Channel mention", type: [main.args_types.number, main.args_types.void_channel_mention]},
				{ name: "Id of Destination Channel or Destination channel mention", type: [main.args_types.number, main.args_types.void_channel_mention]}
			]
		}
	}
	
	if (args == undefined || msg == undefined) return;

	if (args[0].charAt(0) == '<') args[0] = args[0].substr(2, args[0].length - 3);
	if (args[1].charAt(0) == '<') args[1] = args[1].substr(2, args[1].length - 3);

    if (msg == undefined) return;
	if (args?.length != 2) return;
	try {	
		var arr = msg.guild?.channels.cache.array()
		var channels:Array<any> = []
		for (var i = 0; i < 2; i ++) {
			var found = false;
			if (!arr) return;
			for (var j = 0; j < arr.length; j ++) {
				if (arr[j].id == args[i] && arr[j].type == "voice") {
					found = true;
					channels.push(arr[j])
				}
			}
			if (!found) {
				return embed.error(msg.channel, `There is no voice channel with the id \`${args[i]}\`!`, "");	
			}
		}
		for (var k in channels[0].members.array()) {
			channels[0].members.array()[k].edit({ channel: channels[1] })
		}
		return embed.message(msg.channel, `Succesfully moved all users from ${channels[0].name} to ${channels[1].name}.`, "")
	} catch(e) {
		main.catch_err(e, msg)
		return
	}
}

export function cmd_move_user(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.manage_channels,
			description: "Move a user to a channel.",
			args: [
				{ name: "Id of User", type: [main.args_types.number]},
				{ name: "Id of Destination Channel", type: [main.args_types.number]}
			]
		}
	}

    if (msg == undefined) return;
	if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Id of user, Id of channel]!", "");
	try {	
		var channel_arr = msg.guild?.channels.cache.array()
		var found = false;
		if (!channel_arr) return;
		for (var i = 0; i < channel_arr.length; i ++) {
			if (channel_arr[i].id == args[1] && channel_arr[i].type == "voice") {
				found = true
			}
		}

		if (!found) {
			return embed.error(msg.channel, `There is no voice channel with the id \`${args[1]}\`!`, "");	
		}

		var users_arr = msg.guild?.members.cache.array()
		
		found = false
		if (!users_arr) return;
		for (var i = 0; i < users_arr.length; i ++) {
			if (users_arr[i].id == args[0]) {
				found = true
				users_arr[i].edit({ channel: args[1] }).then(() => {
					return embed.message(msg.channel, `The user was succesfully moved.`, "")
				})
			}
		}
		if (!found)
			return embed.error(msg.channel, `There is no user with the id \`${args[0]}\`!`, "");	
		
	} catch(e) {
		main.catch_err(e, msg)
	}
}
