import * as Discord from "discord.js";
import * as fs from "fs";
import { PermList } from "./permissions";
import * as helper from "./helper";
import * as cmd_perm from "./Commands/permissions";
import * as embed from "./Commands/embed";
import * as tagesschau from "./Commands/tagesschau";

const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf8"));

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

var servers: Array<Server> = [];

client.on("ready", () => {
    console.log("Logged in as " + client.user?.username + "...");
});

var cmdmap: Array<Command> = [
    { invoke: "help", command: cmd_help },
    { invoke: "tagesschau_search", command: tagesschau.cmd_search },
    { invoke: "tagesschau_news", command: tagesschau.cmd_news },
    { invoke: "permission_add", command: cmd_perm.cmd_addPermission },
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
                                permission: PermList.admin,
                            });
                        } else {
                            servers[serverIndex].users.push({
                                id: msg.member?.id,
                                permission: PermList.none,
                            });
                        }
                    }
                    if (helper.hasPermissions(helper.getUser(msg.member?.id, servers[serverIndex]), get_cmd(invoke)(undefined, undefined, "get_permission"))) {
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
    var exists = false;
    for (var cmd in cmdmap) {
        if (cmdmap[cmd].invoke == invoke) {
            exists = true;
        }
    }
    return exists;
}

function get_cmd(invoke: string) {
    console.log(invoke);
    for (var cmd in cmdmap) {
        if (cmdmap[cmd].invoke == invoke) {
            return cmdmap[cmd].command;
        }
    }
    return cmdmap[0].command;
}

function catch_err(err: string, msg: Discord.Message) {
    embed.error(msg.channel, err, "Error");
    console.log("ERROR: " + err);
}

function cmd_help(msg: any, args: any, modus: any) {
    if (modus == "get_command") return "help";
    if (modus == "get_permission") return PermList.none;
    if (modus == "get_description") return "get a list of all commands";
    if (args?.length != 0) return embed.error(msg?.channel, "This command doesnt need any arguments!", "");

    var help_msgs: Array<string> = [];
    for (var cmd in cmdmap) {
        help_msgs.push(cmdmap[cmd].invoke);
    }
    var help_msg = "";
    for (var i = 0; i < help_msgs.length; i++) {
        if (i != 0) help_msg += "\n";
        help_msg += "-" + help_msgs[i] + ": " + get_cmd(help_msgs[i])(undefined, undefined, "get_description");
    }
    embed.message(msg?.channel, help_msg, "");
}

client.login(config.token);
console.log(get_cmd("help"));
