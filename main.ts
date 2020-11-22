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
export interface Server {
    id: string;
    users: Array<User>;
}

interface Command {
    invoke: string;
    command: any;
}

interface CommandGroup {
	name: string;
	commands: Array<Command>;
}

export var servers: Array<Server> = [];

client.on("ready", () => {
	setup_mongodb();
    console.log("Logged in as " + client.user?.username + "...");
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
		{ invoke: "give_role_self", command: roles.cmd_giveRoleSelf }
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
                // ::say hello world!
                var invoke = cont.split(" ")[0].substring(config.prefix.length);
                var args = cont.split(" ").slice(1);

                if (cmd_exists(invoke)) {
                    if (helper.isServerKnown(msg.guild.id, servers) == undefined) {
                        servers.push({
                            id: msg.guild.id,
                            users: [],
                        });
                    }
                    var serverIndex = helper.isServerKnown(msg.guild.id, servers);
                    if (!serverIndex) serverIndex = 0;

                    if (!helper.isUserKnown(msg.member?.id, servers[serverIndex].users)) {
                        if (msg.member?.id == config.ownerID) {
                            servers[serverIndex].users.push({
                                id: msg.member?.id,
                                permission: perm.list.admin,
                            });
                        } else {
                            servers[serverIndex].users.push({
                                id: msg.member?.id,
                                permission: perm.list.none,
                            });
                        }
                    }
                    if (cmd_perm.hasPermissions(helper.getUser(msg.member?.id, servers[serverIndex]), get_cmd(invoke)(undefined, undefined, "get_permission"))) {
                        get_cmd(invoke)(msg, args, undefined);
                    } else {
                        embed.error(msg.channel, "You dont have the needed Permissions!", "");
                    }
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
			help_msg += "-" + config.prefix + help_msgs[i] + ": " + get_cmd(help_msgs[i])(undefined, undefined, "get_description");
		}
	}
    embed.message(msg?.channel, help_msg, "");
}

function setup_mongodb() {
	MongoClient.connect(config.mongo_url, function (err, client) {
		db = client.db("bgfxc4s-bot");
	});	
}

client.login(config.token);
