import * as main from "../main"
import * as Discord from "discord.js"
import * as perm from "../permissions";
import * as embed from "./embed"
import * as https from "https"

export function cmd_IFeelAwesome(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_command") return "i_feel_awesome";
    if (modus == "get_permission") return perm.list.none;
    if (modus == "get_description") return "Execute, if you feel awesome today.";
    if (args?.length != 0) return embed.error(msg?.channel, "This command doesnt need any arguments!", "");
	
	var options = {
		hostname: "bgfxc4.de",
		path: "/awesome",
		port: 443
	}	
	https.get(options, req => {
		var data = ""
		req.on("data", d => {
			data += d
		})
		req.on("end", () => {
			var names = data.split("\n")
			var name = names[Math.floor(Math.random() * names.length)] + " is awesome"
			msg?.member?.setNickname(name).then(() => {
				embed.message(msg?.channel, `Nice that you feel awesome today,  \`${name}\`.`, "")
			})
		})
	})
}
