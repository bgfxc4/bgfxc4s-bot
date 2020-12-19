import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import {checkServerIdentity} from "tls";

export function cmd_move_all_to_other_channel(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Id of Source Channel, Id of Destination Channel] Move all users from the Source Channel to the Destination Channel.";
    if (modus == "get_permission") return perm.list.manage_channels
    if (msg == undefined) return;
	if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Id of Source Channel, Id of Destination Channel]!", "");
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
	} catch {
		return embed.error(msg.channel, "Something went wrong, please contact the supporter", "")
	}
}

export function cmd_swap_two_channels(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Id of first Channel, Id of second Channel] Swap the position of the two channels.";
    if (modus == "get_permission") return perm.list.manage_channels
    if (msg == undefined) return;
	if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Id of first Channel, Id of second Channel]!", "");
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

		if (channels[0].parentID != channels[1].parentID) {


		} else {
			var pos2 = channels[1].position
			channels[1].setPosition(channels[0].position).then(() => {
				channels[0].setPosition(pos2)
			})
		}
	} catch {
		return embed.error(msg.channel, "Something went wrong, please contact the supporter", "")
	}
}
