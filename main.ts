import { Db, MongoClient } from "mongodb";
import * as Discord from "discord.js";
import * as fs from "fs";
import * as perm from "./permissions";
import * as helper from "./helper";
import * as cmd_perm from "./Commands/permissions";
import * as embed from "./Commands/embed";
import * as tagesschau from "./Commands/tagesschau";
import * as space_launch from "./Commands/space_launch";
import * as roles from "./Commands/roles";
import * as channels from "./Commands/channel"
import * as insults from "./Commands/insults"
import * as useless_stuff from "./Commands/useless_stuff"
import * as debug from "./Commands/debug"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf8"));

export var db: Db; 

export var client = new Discord.Client();

export enum args_types {
	number,
	text,
	text_with_spaces,
	user_mention,
	void_channel_mention
}

export interface User {
    id: string | undefined;
    permission: number;
}

export interface Role {
	id: number;
	name: string;
}

export interface Server {
    id: string;
    users: Array<User>;
	roles_to_manage: Array<Role>
}

interface Command {
    invoke: string;
    command: any;
	show_on_list?: boolean
}

interface CommandGroup {
	name: string;
	commands: Array<Command>;
	show_on_list?: boolean
}

client.on("ready", () => {
	setup_mongodb();
    console.log("[Discord.js] Logged in as " + client.user?.username + "...");
	client.user?.setActivity(config.prefix + "help", { type: "LISTENING"}).catch(console.log)
});

export var cmdmap: Array<CommandGroup> = [
	{ name: "General", commands: [
		{ invoke: "help", command: cmd_help },
		{ invoke: "group_help", command: cmd_group_help },
		{ invoke: "command_help", command: cmd_command_help },
		{ invoke: "ping", command: cmd_ping },
	]},
	{ name: "Tagesschau", commands: [
	    { invoke: "tagesschau_search", command: tagesschau.cmd_search },
		{ invoke: "tagesschau_news", command: tagesschau.cmd_news },
	]},
	{ name: "Permissions", commands: [
		{ invoke: "permission_add", command: cmd_perm.cmd_addPermission },
		{ invoke: "permission_remove", command: cmd_perm.cmd_removePermission },
		{ invoke: "permission_get", command: cmd_perm.cmd_getPermission },
		{ invoke: "permission_list", command: cmd_perm.cmd_permission_list },
	]},
	{ name: "Space Launches", commands: [
		{ invoke: "spacelaunch_last", command: space_launch.cmd_lastLaunch },
		{ invoke: "spacelaunch_next", command: space_launch.cmd_nextLaunch },
		{ invoke: "spacelaunch_lastSpaceX", command: space_launch.cmd_lastSpaceXLaunch },
		{ invoke: "spacelaunch_nextSpaceX", command: space_launch.cmd_nextSpaceXLaunch },
	]},
	{ name: "Roles", commands: [
		{ invoke: "give_role_self", command: roles.cmd_giveRoleSelf },
		{ invoke: "remove_role_self", command: roles.cmd_removeRoleSelf },
		{ invoke: "list_roles", command: roles.cmd_list_roles },
		{ invoke: "add_managed_role", command: roles.cmd_addManagedRole },
		{ invoke: "remove_managed_role", command: roles.cmd_removeManagedRole },
		{ invoke: "give_role", command: roles.cmd_giveRole },
		{ invoke: "remove_role", command: roles.cmd_removeRole }
	]},
	{ name: "Channels", commands: [
		{ invoke: "move_all_users", command: channels.cmd_move_all_to_other_channel },
		{ invoke: "move_user", command: channels.cmd_move_user }
	]},
	{ name: "Insults", commands: [
		{ invoke: "insult", command: insults.cmd_insult},
		{ invoke: "insult_dm", command: insults.cmd_insult_dm}
	]},
	{ name: "Useless stuff", commands: [
		{ invoke: "open_source", command: useless_stuff.cmd_OpenSource}
	]},
	{ name: "Debug", commands: [
		{ invoke: "get_pid", command: debug.cmd_get_pid, show_on_list: false },
		{ invoke: "eval", command: debug.cmd_eval, show_on_list: false },
		{ invoke: "tmp_cmd", command: debug.cmd_temp_cmd, show_on_list: false }
	], show_on_list: false}
];

client.on("message", (msg) => {
    if (!msg.guild) return;
    if (msg.member?.id == client.user?.id) return;

    var cont = msg.content;
    var author = msg.member;

    try {
        if (author?.id != null && client.user?.id != null) {
            if (author.id != client.user.id && cont.startsWith(config.prefix)) {
                var invoke = cont.split(" ")[0].substring(config.prefix.length);
                var args = cont.split(" ").slice(1);

                if (cmd_exists(invoke)) {
					check_server_and_user(msg, args, invoke, (user) => {
						if (cmd_perm.hasPermissions(user, get_cmd(invoke)(undefined, undefined, true).permission)) {
							if (check_args(msg, invoke, args, get_cmd(invoke)(undefined, undefined, true).args))
							get_cmd(invoke)(msg, args, undefined);
						} else {
							embed.error(msg.channel, "You dont have the required Permissions!", "");
						}
					});
                } else {
                    embed.error(msg.channel, `The command \`${invoke}\` does not exist!`, "");
                }
            }
        }
    } catch (err) {
        catch_err(err, msg);
    }
});

function cmd_exists(invoke: string) {
    for (var cmd_group in cmdmap) {
		for (var cmd in cmdmap[cmd_group].commands) {
			if (cmdmap[cmd_group].commands[cmd].invoke == invoke) {
				return true;
			}
		}
    }
    return false;
}

function check_args(msg: Discord.Message, command: string,given_args: Array<string>, required_args: any) {
	if (required_args.length != given_args.length && required_args[required_args.length - 1].type != args_types.text_with_spaces) {
		embed.error(msg.channel, `This command needs ${required_args.length} arguments, but you gave ${given_args.length}.\n
					To get more info about this command and its arguments, use \`${config.prefix}command_help ${command}\``, "");
		return false;
	}
	for (var i = 0; i < required_args.length; i++) {
		var valid = false;
		for (var j = 0; j < required_args[i].type.length; j++) {
			if (check_arg(msg, given_args[i], i, required_args[i].type[j], command)) valid = true;
		}
		if (!valid) {
			embed.error(msg.channel, `The ${i + 1}. argument is wrong.\n
						To get more info about this command and its arguments, use \`${config.prefix}command_help ${command}\``, "");
			return false;
		}
	}
	return true;
}

function check_arg(msg: Discord.Message, arg: string, arg_index: number, arg_type: any, command: string) {
	if (arg_type == args_types.number) {
		if (!+arg) {
			return false;
		}
	} else if (arg_type == args_types.user_mention) {
		var mentions = /<@!(\d+)>/g.exec(arg);
		if (!mentions?.length) {
			return false;
		}
		if (mentions[0] != arg) {
			return false;
		}

		var users = msg.guild?.members.cache.array();
		if (users == undefined) return false;
		var found = false;
		for (var user of users) {
			if (user.id == mentions[1]) {
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}
	} else if (arg_type == args_types.void_channel_mention) {
		var mentions = /<#(\d+)>/g.exec(arg);
		if (!mentions?.length) {
			return false;
		}
		if (mentions[0] != arg) {
			return false;
		}

		var channels = msg.guild?.channels.cache.array();
		if (channels == undefined) return false;
		var found = false;
		for (var channel of channels) {
			if (channel.id == mentions[1] && channel.type == "voice") {
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}

	}
	return true;
}

function get_cmd(invoke: string) {
	for (var cmd_group in cmdmap) {
		for (var cmd in cmdmap[cmd_group].commands) {
			if (cmdmap[cmd_group].commands[cmd].invoke == invoke) {
				return cmdmap[cmd_group].commands[cmd].command;
			}
		}
    }
    return cmdmap[0].commands[0].command;
}

export function catch_err(err: string, msg: Discord.Message) {
    embed.error(msg.channel, err, "Error");
    console.log("ERROR: " + err);
}

function cmd_help(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get a list of all command groups.",
			args: []
		}
	}

    var base = `All of the command groups are:\n`;

	var help_msg = base;
	for (var cmd_group of cmdmap) {
		if (cmd_group.show_on_list == true || cmd_group.show_on_list == undefined)
			help_msg += "\n\u27A4\`" + cmd_group.name + "\`";
	}
	help_msg += `\n\nuse the command \`${config.prefix}group_help [group name]\` to get all commands from one group.`
    embed.message(msg?.channel, help_msg, "");
}

function cmd_group_help(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {	
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get a list and short description of all commands in one group.",
			args: [
				{ name: "Name of group", type: [args_types.text_with_spaces]}
			]
		}
	}
	
	if (args == undefined) return

    var base = `All of the commands in the group \`${args.join(' ')}\` are:\n\n`;
	var help_msg = base;
	for (var cmd_group in cmdmap) {
		if (cmdmap[cmd_group].name.toLowerCase() != args.join(' ').toLowerCase()) continue;

		if (cmdmap[cmd_group].show_on_list === false) continue;
		var help_msgs: Array<string> = [];
		for (var cmd in cmdmap[cmd_group].commands) {
			if (cmdmap[cmd_group].commands[cmd].show_on_list === false) continue; 
			help_msgs.push(cmdmap[cmd_group].commands[cmd].invoke);
		}
		
		for (var i = 0; i < help_msgs.length; i++) {
			if (i != 0) help_msg += "\n" ;
			help_msg += "\u27A4 \`" + config.prefix + help_msgs[i] + "\`: " + get_cmd(help_msgs[i])(undefined, undefined, true).description;
		}

		help_msg += `\n\nTo get more info on a specific command, you can try \`${config.prefix}command_help [command]\`!`;

		return embed.message(msg?.channel, help_msg, "");
	}
    embed.error(msg?.channel, `There is no command group named \`${args.join(' ')}\`!`, "");
}

function cmd_command_help(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {	
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get a list and short description of all commands in one group.",
			args: [
				{ name: "Name of command", type: [args_types.text]}
			]
		}
	}

	if (args?.length != 1) return;

	if (!cmd_exists(args[0])) {
		return embed.error(msg?.channel, `The command ${args[0]} does not exist!`, "");
	}

	var info = get_cmd(args[0])(undefined, undefined, true);

	var help_msg = `**Description:**\n${info.description}`;

	if (info.args.length != 0)
		help_msg += `\n**Arguments:**`;

	for (var arg of info.args)
		help_msg += `\n\tName: ${arg.name} Type: ${arg_to_text(arg)}`;

	help_msg +=  `\n**Required permission:**\n${perm_to_text(info.permission)}`;

    embed.message(msg?.channel, help_msg, "");
}

function cmd_ping(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Test, if my connection is working.",
			args: []
		}
	}
	if (msg == undefined) return;
	embed.message(msg?.channel, `This answer took me \`${Date.now() - msg?.createdTimestamp}\` ms.`, "");
}

function arg_to_text(arg: any) {
	var str = "";
	for (var i = 0; i < arg.type.length; i++) {
		if (i != 0) str += ", or ";
		switch(arg.type[i]){
			case args_types.text:
				str += "Text (only one word)";
				break;
			case args_types.number:
				str += "Number (no . or ,)";
				break;
			case args_types.text_with_spaces:
				str += "Text (multiple words)";
				break;
			case args_types.user_mention:
				str += "User mention (e.g. <@!691979492662444073>)"
				break;
			case args_types.void_channel_mention:
				str += "Voice channel mention"
				break;
			default: 
				str += "An error occured";
		}
	}
	return str;
}

function perm_to_text(perm_in: any) {
	var perm_entries = Object.entries(perm.list);
	for (var perm_entry of perm_entries) {
		if (perm_entry[1] == perm_in)
			return perm_entry[0];
	}
	return "An error occured";
}

function check_server_and_user(msg: Discord.Message, args: Array<string>, invoke: string, callback: (user: User | undefined) => void) {
	helper.isServerKnown(msg.guild?.id, (found) => {
		if (!found) {
			helper.add_server_to_db(msg.guild?.id, () => {
				after_callback();
				return;
			});
		} else {
			after_callback();
		}
		function after_callback() {
			helper.isUserKnown(msg.member?.id, msg.guild?.id, (found_user) => {
				if (!found_user) {
					if (msg.member?.id == config.ownerID) {
						helper.add_new_user_to_db(msg.member?.id, perm.list.admin, msg.guild?.id, () => {
							helper.getUser(msg.member?.id, msg.guild?.id, (user) => {
								callback(user);
								return;
							});
						});
					} else {
						helper.add_new_user_to_db(msg.member?.id, perm.list.none, msg.guild?.id, () => {
							helper.getUser(msg.member?.id, msg.guild?.id, (user) => {
								callback(user);
								return;
							});
						});
					}
				} else {
					helper.getUser(msg.member?.id, msg.guild?.id, (user) => {
						callback(user);
					});
				}
			});
		}
	});
}

function setup_mongodb() {
	MongoClient.connect(config.mongo_url, {useNewUrlParser: true, useUnifiedTopology: true}).then(client => {
		db = client.db("bgfxc4s-bot");
		console.log("[Database] connected succesfully to database!");
	});	
}

client.login(config.token);
