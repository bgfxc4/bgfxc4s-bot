import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import * as main from "../main";
import * as helper from "../helper";

export function cmd_addPermission(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[userID, name of permission to add] add permission to other users.";
    if (modus == "get_permission") return perm.list.managePermissions;
    if (msg == undefined) return;
    if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [userID, name of permission to add]!", "");

    if (!isUserOnServer(msg?.guild, args[0])) return embed.error(msg.channel, "The user with the ID " + args[0] + " is not on this server!", "");
    if (!helper.isUserKnown(args[0], helper.getServer(msg.guild?.id)?.users)) {
        if (args[0] == main.config.ownerID) {
            helper.getServer(msg.guild?.id)?.users.push({
                id: args[0],
                permission: perm.list.admin,
            });
        } else {
            helper.getServer(msg.guild?.id)?.users.push({
                id: args[0],
                permission: perm.list.none,
            });
        }
    }
    var user = helper.getUser(args[0], helper.getServer(msg.guild?.id));
    var permission = getPermissionByName(args[1]);

    if (permission == perm.list.none) return embed.error(msg.channel, "This Permission cant be added!", "");
    if (permission == undefined) return embed.error(msg.channel, "The permission " + args[1] + " doesnt exist!", "");
    if (hasPermissions(user, permission)) return embed.message(msg.channel, "The user has already the permission.", "");
    if (addPermission(args[0], msg.guild?.id, permission)) {
        embed.message(msg.channel, "Permission " + args[1] + " was given succesfully to the user " + args[0] + ".", "");
    } else {
        embed.error(msg.channel, "Something went wrong!", "");
    }
}

export function cmd_removePermission(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[userID, name of permission to remove] remove a permission from other users.";
    if (modus == "get_permission") return perm.list.managePermissions;
    if (msg == undefined) return;
    if (args == undefined || args[0] == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [userID, name of permission to remove]!", "");

    if (!isUserOnServer(msg?.guild, args[0])) return embed.error(msg.channel, "The user with the id " + args[0] + " is not on this server!", "");
    if (!helper.isUserKnown(args[0], helper.getServer(msg.guild?.id)?.users)) {
        if (args[0] == main.config.ownerID) {
            helper.getServer(msg.guild?.id)?.users.push({
                id: args[0],
                permission: perm.list.admin,
            });
        } else {
            helper.getServer(msg.guild?.id)?.users.push({
                id: args[0],
                permission: perm.list.none,
            });
        }
    }
    var user = helper.getUser(args[0], helper.getServer(msg.guild?.id));
    var permission = getPermissionByName(args[1]);
    if (permission == perm.list.none) return embed.error(msg.channel, "This Permission cant be removed!", "");
    if (permission == undefined) return embed.error(msg.channel, "The permission " + args[1] + " doesnt exist!", "");
    if (!hasPermissions(user, permission)) return embed.error(msg.channel, "The user has not the permission you want to remove.", "");
    if (removePermission(args[0], msg.guild?.id, permission)) {
        embed.message(msg.channel, "Permission " + args[1] + " was succesfully removed from the user " + args[0] + ".", "");
    } else {
        embed.error(msg.channel, "Something went wrong!", "");
    }
}

export function cmd_getPermission(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[userID] get current Permissions from the user.";
    if (modus == "get_permission") return perm.list.none;
    if (msg == undefined) return;
    if (args == undefined || args[0] == undefined || args.length != 1) return embed.error(msg.channel, "You need to specify one arguments [userID]!", "");
    if (!isUserOnServer(msg?.guild, args[0])) return embed.error(msg.channel, "The user with the id " + args[0] + " is not on this server!", "");
    if (!helper.isUserKnown(args[0], helper.getServer(msg.guild?.id)?.users)) {
        if (args[0] == main.config.ownerID) {
            helper.getServer(msg.guild?.id)?.users.push({
                id: args[0],
                permission: perm.list.admin,
            });
        } else {
            helper.getServer(msg.guild?.id)?.users.push({
                id: args[0],
                permission: perm.list.none,
            });
        }
    }
    var user = helper.getUser(args[0], helper.getServer(msg.guild?.id));
    if (user == undefined) return embed.error(msg.channel, "You need to specify one arguments [userID]!", "");
    var allPermissions: Array<number> = Object.values(perm.list);
    var answer = "";
    for (var i = 0; i < allPermissions.length; i++) {
        if (i != 0) answer += ", ";
        if (hasPermissions(user, allPermissions[i])) answer += Object.keys(perm.list)[i];
    }
    embed.message(msg.channel, "The user " + args[0] + " has the permissions " + answer, "");
}

export function hasPermissions(user: main.User | undefined, permissonToTest: number) {
    if (!user) return undefined;
    if ((user.permission & perm.list.admin) == perm.list.admin) return true;
    return (user.permission & permissonToTest) == permissonToTest;
}

export function getPermissionByName(permission: string) {
    for (var i in Object.keys(perm.list)) {
        if (Object.keys(perm.list)[i] == permission) {
            return Object.values(perm.list)[i];
        }
    }
    return undefined;
}

function addPermission(userID: string, serverID: string | undefined, permissionToAdd: number) {
    var user = helper.getUser(userID, helper.getServer(serverID));
    if (!user) return false;
    user.permission = user.permission | permissionToAdd;
    return true;
}

function removePermission(userID: string, serverID: string | undefined, permissionToRemove: number) {
    var user = helper.getUser(userID, helper.getServer(serverID));
    if (!user) return false;
    user.permission = user.permission ^ permissionToRemove;
    return true;
}

function isUserOnServer(guild: Discord.Guild | null, userID: string) {
    if (guild?.member(userID)) {
        return true;
    } else {
        return false;
    }
}
