import * as main from "../main"
import * as Discord from "discord.js"
import * as perm from "../permissions";
import * as embed from "./embed"
import * as https from "https"

export function cmd_insult(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Insult somebody you dont like.",
			args: [
				{ name: "Mention the user you want to insult", type: [main.args_types.user_mention]}
			]
		}
	}

    if (args?.length != 1 || msg == undefined) return;

	var user = msg.mentions.users.first();

	var options = {
		hostname: "insult.mattbas.org",
		path: "/api/insult?template=you%20are%20as%20<adjective>%20as%20<article%20target=adj1>%20<adjective%20min=1%20max=3%20id=adj1>%20<amount>%20of%20<adjective%20min=1%20max=3>%20<animal>%20<animal_part>",
		port: 443
	}
	https.get(options, req => {
		var data = ""
		req.on("data", d => {
			data += d
		})
		req.on("end", () => {
			embed.message(msg.channel, `<@${user?.id}>, ${data}`, "");
		})

		req.on("error", (err) => {
			return embed.error(msg.channel, `An error occured: \n\`\`\`${err}\`\`\`\n\nPlease contact the developer.`, "");
		})
	})
}

export function cmd_insult_dm(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Insult somebody you dont like per DM.",
			args: [
				{ name: "Mention the user you want to insult", type: [main.args_types.user_mention]}
			]
		}
	}

    if (args?.length != 1 || msg == undefined) return;

	var user = msg.mentions.users.first();

	var options = {
		hostname: "insult.mattbas.org",
		path: "/api/insult",
		port: 443
	}
	https.get(options, req => {
		var data = ""
		req.on("data", d => {
			data += d
		})
		req.on("end", () => {
			user?.createDM().then(ch => {
				embed.message(ch, `${data}\n\nYou were insulted by the user \`${user?.username}\` from the server \`${msg.guild?.name}\`.`, 
							  "", (() => {
									embed.message(msg.channel, `The user \`${user?.username}\` was insulted per DM.`, "");
							  }));
			})
		})

		req.on("error", (err) => {
			return embed.error(msg.channel, `An error occured: \n\`\`\`${err}\`\`\`\n\nPlease contact the developer.`, "");
		})
	})
}
