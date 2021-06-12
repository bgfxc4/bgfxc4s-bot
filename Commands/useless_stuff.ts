import * as main from "../main"
import * as Discord from "discord.js"
import * as perm from "../permissions";
import * as embed from "./embed"
import * as https from "https"

export function cmd_OpenSource(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get infos about this bot.",
			args: []
		}
	}
	
	embed.message(msg?.channel, "This bot is fully open source. If you want to contribute to it or just want to read through the code (trust me, you don't want to do that), you can find it on github [here](https://github.com/bgfxc4/bgfxc4s-bot)", "")

}
