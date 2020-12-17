import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";

export function cmd_move_all_to_other_channel(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Source Channel, Destination Channel] Move all users from the Source Channel to the Destination Channel.";
    if (modus == "get_permission") return perm.list.manage_channels
    if (msg == undefined) return;
	if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Source Channel, Destination Channel]!", "");
	try {	
		var arr = msg.guild?.channels.cache.array()
		var channels:Array<any> = []
		for (var i = 0; i < 2; i ++) {
			var found = false;
			if (!arr) return;
			for (var j = 0; j < arr.length; j ++) {
				if (arr[j].name == args[i] && arr[j].type == "voice") {
					found = true;
					channels.push(arr[j])
				}
			}
			if (!found) {
				return embed.error(msg.channel, `There is no voice channel named \`${args[i]}\`!`, "");	
			}
		}
		for (var k in channels[0].members.array()) {
			channels[0].members.array()[k].edit({ channel: channels[1] })
		}
	} catch {
		return embed.error(msg.channel, "Someting went wrong, please contact the supporter", "")
	}
}

