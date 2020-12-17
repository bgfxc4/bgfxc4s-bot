import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";

export function cmd_move_all_to_other_channel(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Source Channel, Destination Channel] Move all users from the Source Channel to the Destination Channel.";
    if (modus == "get_permission") return perm.list.manage_channels
    if (msg == undefined) return;
	if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Source Channel, Destination Channel]!", "");

}

