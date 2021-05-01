import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as embed from "./embed";
import * as main from "../main";
import * as helper from "../helper";

export function cmd_addPermission(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.manage_permissions,
			description: "Add a permission to other users.",
			args: [ 
				{ name: "Id of User", type: [main.args_types.number]},
				{ name: "Name of permission to add", type: [main.args_types.text]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined || args.length != 2) return;

	isUserOnServer(msg?.guild, args[0], (ret) => {
		if (!ret) return embed.error(msg.channel, "The user with the Id " + args[0] + " is not on this server!", "");
		helper.isUserKnown(args[0], msg.guild?.id, (found) => {
			if (!found) {
				if (args[0] == main.config.ownerID) {
					helper.add_new_user_to_db(args[0], perm.list.admin, msg.guild?.id, () => {
						add_permission_action(msg, args);
						return;
					});
				} else { 
					helper.add_new_user_to_db(args[0], perm.list.none, msg.guild?.id, () => {
						add_permission_action(msg, args);
						return;
					});
				}
			}
			add_permission_action(msg, args);
			function add_permission_action(msg: Discord.Message, args: Array<string>) {
				helper.getUser(args[0], msg.guild?.id, (user => {
					var permission = getPermissionByName(args[1]);
					if (permission == perm.list.none) return embed.error(msg.channel, "This Permission cant be added!", "");
					if (permission == undefined) return embed.error(msg.channel, "The permission " + args[1] + " doesnt exist! Use permission_list to get a list of all permissions.", "");
					if (hasPermissions(user, permission)) return embed.message(msg.channel, "The user has already the permission.", "");
					if (addPermission(args[0], msg.guild?.id, permission)) {
						embed.message(msg.channel, "Permission " + args[1] + " was given succesfully to the user " + args[0] + ".", "");
					} else {
						embed.error(msg.channel, "Something went wrong!", "");
					}
				}));
			}
		});
	});
}


export function cmd_removePermission(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.manage_permissions,
			description: "Remove a permission from other users.",
			args: [ 
				{ name: "Id of User", type: [main.args_types.number]},
				{ name: "Name of permission to add", type: [main.args_types.text]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined || args[0] == undefined || args.length != 2) return;

	isUserOnServer(msg?.guild, args[0], (ret) => {
		if (!ret) return embed.error(msg.channel, "The user with the id " + args[0] + " is not on this server!", "");
		helper.isUserKnown(args[0], msg.guild?.id, (found) => {
			if (!found) {
				if (args[0] == main.config.ownerID) {
					helper.add_new_user_to_db(args[0], perm.list.admin, msg.guild?.id, () => {
						remove_permission_action(msg, args);
						return;
					});
				} else { 
					helper.add_new_user_to_db(args[0], perm.list.none, msg.guild?.id, () => {
						remove_permission_action(msg, args);
						return;
					});
				}
			}
			remove_permission_action(msg, args);
			function remove_permission_action(msg: Discord.Message, args: Array<string>) {
				helper.getUser(args[0], msg.guild?.id, (user) => {
					var permission = getPermissionByName(args[1]);
					if (permission == perm.list.none) return embed.error(msg.channel, "This Permission cant be removed!", "");
					if (permission == undefined) return embed.error(msg.channel, "The permission " + args[1] + " doesnt exist! Use permission_list to get a list of all permissions.", "");
					if (!hasPermissions(user, permission)) return embed.error(msg.channel, "The user has not the permission you want to remove.", "");
					removePermission(args[0], msg.guild?.id, permission, (ret => {
						if (ret) {
							embed.message(msg.channel, "Permission " + args[1] + " was succesfully removed from the user " + args[0] + ".", "");
						} else {
							embed.error(msg.channel, "Something went wrong!", "");
						}
					}));
				});
			}
		});
	});

}


export function cmd_getPermission(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get current Permissions from a user.",
			args: [ 
				{ name: "Id of User", type: [main.args_types.number]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined || args[0] == undefined || args.length != 1) return;

	isUserOnServer(msg?.guild, args[0], (ret) => {
		if (!ret) return embed.error(msg.channel, "The user with the id " + args[0] + " is not on this server!", "");
		helper.isUserKnown(args[0], msg.guild?.id, (found) => {
			if (!found) {
				if (args[0] == main.config.ownerID) {
					helper.add_new_user_to_db(args[0], perm.list.admin, msg.guild?.id, () => {
						get_permission_action(msg, args);
						return;
					});
				} else { 
					helper.add_new_user_to_db(args[0], perm.list.none, msg.guild?.id, () => {
						get_permission_action(msg, args);
						return;
					});
				}
			}
			get_permission_action(msg, args);
			function get_permission_action(msg: Discord.Message, args: Array<string>) {
				helper.getUser(args[0], msg.guild?.id, (user) => {
					if (user == undefined) return embed.error(msg.channel, "You need to specify one arguments [userID]!", "");
					var allPermissions: Array<number> = Object.values(perm.list);
					var answer = "";
					for (var i = 0; i < allPermissions.length; i++) {
						if (hasPermissions(user, allPermissions[i])) {
							if (i != 0) answer += ", ";
							answer += Object.keys(perm.list)[i];
						}
					}
					embed.message(msg.channel, "The user " + args[0] + " has the permissions " + answer, "");
				});
			}
		});
	});
}


export function cmd_permission_list(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get a list of all permissions",
			args: []
		}
	}
   
	var allKeys = Object.keys(perm.list);
    var str = "";
    for (var i = 0; i < allKeys.length; i++) {
        if (i != 0) str += ", ";
        str += allKeys[i];
    }
    embed.message(msg?.channel, "all Permissions: " + str, "");
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

function addPermission(user_id: string, server_id: string | undefined, permission_to_add: number) {
	var query = { id: server_id}
	main.db.collection("servers").findOne(query, (err, res) => {
		if(err) throw err;
		var user_to_add_perm;
		for (var user in res.users) {
			if (res.users[user].id == user_id) {
				user_to_add_perm = user;
				continue;
			}
		}
		if (!user_to_add_perm) return false;
		res.users[user_to_add_perm].permission = res.users[user_to_add_perm].permission | permission_to_add;
		var to_update = { $set: { users: res.users } };
		main.db.collection("servers").updateOne(query, to_update, (err, res) => {
			if(err) throw err;
			console.log("[Database] updated one permission");	
		});
	});
	return true;
}

function removePermission(user_id: string, server_id: string | undefined, permission_to_remove: number, callback: (ret: boolean) => void) {
	var query = { id: server_id}
	main.db.collection("servers").findOne(query, (err, res) => {
		if(err) throw err;
		var user_to_add_perm;
		for (var user in res.users) {
			if (res.users[user].id == user_id) {
				user_to_add_perm = user;
				continue;
			}
		}
		if (!user_to_add_perm) {
			callback(false);
			return;
		}
		res.users[user_to_add_perm].permission = res.users[user_to_add_perm].permission ^ permission_to_remove;
		var to_update = { $set: { users: res.users } };
		main.db.collection("servers").updateOne(query, to_update, (err, res) => {
			if(err) throw err;
			console.log("[Database] updated one permission");	
			callback(true);
			return;
		});
	});
}

function isUserOnServer(guild: Discord.Guild | null, user_id: string, callback: (ret: boolean) => void) {
	guild?.members.fetch(user_id).then((member) => { 
		callback(true);
		return;
	}).catch((reason) => { 
		callback(false);
		return;
	});
}
