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

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf8"));

export var db: Db; 

var client = new Discord.Client();

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
}

interface CommandGroup {
	name: string;
	commands: Array<Command>;
}

client.on("ready", () => {
	setup_mongodb();
    console.log("[Discord.js] Logged in as " + client.user?.username + "...");
});

var cmdmap: Array<CommandGroup> = [
	{ name: "General", commands: [
		{ invoke: "help", command: cmd_help },
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
		{ invoke: "remove_managed_role", command: roles.cmd_removeManagedRole }
	]}
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
						if (cmd_perm.hasPermissions(user, get_cmd(invoke)(undefined, undefined, "get_permission"))) {
							get_cmd(invoke)(msg, args, undefined);
						} else {
							embed.error(msg.channel, "You dont have the required Permissions!", "");
						}
					});
                } else {
                    embed.error(msg.channel, "Wrong Invoke!", "");
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

function get_cmd(invoke: string) {
	for (var cmd_group in cmdmap) {
		for (var cmd in cmdmap[cmd_group].commands) {
			if (cmdmap[cmd_group].commands[cmd].invoke == invoke) {
				return cmdmap[cmd_group].commands[cmd].command;;
			}
		}
    }
    return cmdmap[0].commands[0].command;
}

function catch_err(err: string, msg: Discord.Message) {
    embed.error(msg.channel, err, "Error");
    console.log("ERROR: " + err);
}

function cmd_help(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    var base = "Hi, im bgfxc4s bot.\nMy current prefix is " + config.prefix + ". All of my Commands are: \n";
    if (modus == "get_command") return "help";
    if (modus == "get_permission") return perm.list.none;
    if (modus == "get_description") return "get a list of all commands";
    if (args?.length != 0) return embed.error(msg?.channel, "This command doesnt need any arguments!", "");
	
	var help_msg = base;
	for (var cmd_group in cmdmap) {
		var help_msgs: Array<string> = [];
		for (var cmd in cmdmap[cmd_group].commands) {
			help_msgs.push(cmdmap[cmd_group].commands[cmd].invoke);
		}
		help_msg += "\n**" + cmdmap[cmd_group].name  + "**:\n";
		for (var i = 0; i < help_msgs.length; i++) {
			if (i != 0) help_msg += "\n";
			help_msg += "\u27A4 " + config.prefix + help_msgs[i] + ": " + get_cmd(help_msgs[i])(undefined, undefined, "get_description");
		}
	}
    embed.message(msg?.channel, help_msg, "");
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
