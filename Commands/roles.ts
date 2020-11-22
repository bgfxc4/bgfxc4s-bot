import * as perm from "../permissions";
import * as Discord from "discord.js";
import  { MongoClient } from "mongodb";
import * as embed from "./embed";

export function cmd_giveRoleSelf(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role name] give yourself a role.";
    if (modus == "get_permission") return perm.list.none;
    if (msg == undefined) return;
    if (args == undefined || args.length != 1) return embed.error(msg.channel, "You need to specify one argument [Role name]!", "");

 }



