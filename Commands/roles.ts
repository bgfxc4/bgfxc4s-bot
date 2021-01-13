import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as main from "../main";
import * as embed from "./embed";

export function cmd_giveRoleSelf(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role name] give yourself a role.";
    if (modus == "get_permission") return perm.list.none;
    if (msg == undefined) return;
    if (args == undefined || args.length != 1) return embed.error(msg.channel, "You need to specify one argument [Role name]!", "");
	var query = { id: msg.guild?.id };

	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		if (res.roles_to_manage.length == 0) return embed.info(msg.channel, "There are no roles I can manage on this server.", "");
		for(var i in res.roles_to_manage) {
			if (res.roles_to_manage[i].name == args[0]) {
				var role = msg.guild?.roles.cache.find(role => role.name == res.roles_to_manage[i].name);
				if (role != undefined)  {
					msg.member?.roles.add(role).then(() => {
						return embed.message(msg.channel, `The role ${args[0]} was succesfully given to you.`, "");
					}).catch((err) => {
							embed.error(msg.channel, `Someting went wrong, please contact the supporter. Error message: \`${err}\``, "")
					}) 
				} else {
					return embed.error(msg.channel, `The role ${args[0]} does not exist anymore on this server! Pleas delete it out of my list with \`${main.config.prefix}remove_managed_role\``, "");
				}
				return 			
			}
		}
		return embed.error(msg.channel, `I cant manage the role ${args[0]}!`, "");
	});
}

export function cmd_removeRoleSelf(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role name] remoe a role from yourself.";
    if (modus == "get_permission") return perm.list.none;
    if (msg == undefined) return;
    if (args == undefined || args.length != 1) return embed.error(msg.channel, "You need to specify one argument [Role name]!", "");
	var query = { id: msg.guild?.id };

	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		if (res.roles_to_manage.length == 0) return embed.info(msg.channel, "There are no roles I can manage on this server.", "");
		for(var i in res.roles_to_manage) {
			if (res.roles_to_manage[i].name == args[0]) {
				var role = msg.guild?.roles.cache.find(role => role.name == res.roles_to_manage[i].name);
				if (role != undefined)  {
					var has_role = msg.member?.roles.cache.each(role => role.name == args[0]);
					if (has_role != undefined) {
						msg.member?.roles.remove(role.id).then(() => {
							return embed.message(msg.channel, `The role ${args[0]} was succesfully removed from you.`, "");
						}).catch((err) => {
							embed.error(msg.channel, `Someting went wrong, please contact the supporter. Error message: \`${err}\``, "")
						}) 
						return
					} else {
						return  embed.error(msg.channel, `You dont have the role ${args[0]}.`, "");
					}
				} else {
					return embed.error(msg.channel, `The role ${args[0]} does not exist anymore on this server! Pleas delete it out of my list with \`${main.config.prefix}remove_managed_role\``, "");
				}
			}
		}
		return embed.error(msg.channel, `I cant manage the role ${args[0]}!`, "");
	});
}

export function cmd_list_roles(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "get a list of all available roles.";
    if (modus == "get_permission") return perm.list.none;
    if (msg == undefined) return;
    if (args == undefined || args.length != 0) return embed.error(msg.channel, "You dont need to specify an argument!", "");
	
	var list = "**All roles:**\n";

	var query = { id: msg.guild?.id };

	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		if (res.roles_to_manage.length == 0) return embed.info(msg.channel, "There are no roles I can manage on this server.", "");
		for(var i in res.roles_to_manage) {
			if (i != "0") list += ", ";
			list += res.roles_to_manage[i].name;
		}
		return embed.message(msg.channel, list, "");
	});
}

export function cmd_addManagedRole(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role name] add a role that I can manage.";
    if (modus == "get_permission") return perm.list.manage_roles;
    if (msg == undefined) return;
    if (args == undefined || args.length != 1) return embed.error(msg.channel, "You need to specify one argument [Role name]!", "");
	var role = msg.guild?.roles.cache.find(role => role.name == args[0]);
	if (role == undefined) {
		return embed.error(msg.channel, `There is no role named \`${args[0]}\`.\n Tipp: you have to create the role manually and then add it to my managed roles.`, "");
	} else {
		var query = { id: msg.guild?.id }
		main.db.collection("servers").findOne(query, (err, res) => {
			if (err) throw err;
			for (var i in res.roles_to_manage) {
				if (res.roles_to_manage[i].name == role?.name) {
					return embed.info(msg.channel, `The role \`${args[0]}\` is already added.`, "");
				}
			}
			res.roles_to_manage.push({ id: role?.id, name: role?.name});
			var to_set = { $set: { roles_to_manage: res.roles_to_manage}}
			main.db.collection("servers").updateOne(query, to_set, (err, res) => {
				if (err) throw err;
				return embed.message(msg.channel, `Added the role \`${args[0]}\``, "");
			});
		});
	}
}

export function cmd_removeManagedRole(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role name] remove a role that has been added.";
    if (modus == "get_permission") return perm.list.manage_roles;
    if (msg == undefined) return;
    if (args == undefined || args.length != 1) return embed.error(msg.channel, "You need to specify one argument [Role name]!", "");

	var query = { id: msg.guild?.id }
	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		var found = "-1";
		for (var i in res.roles_to_manage) {
			if (res.roles_to_manage[i].name == args[0]) {
				found = i;
				break;
			}
		}
		if (found == "-1"){
			return embed.info(msg.channel, `The role \`${args[0]}\` is already added.`, "");
		}

		res.roles_to_manage.splice(found, 1);
		var to_set = { $set: { roles_to_manage: res.roles_to_manage}}
		main.db.collection("servers").updateOne(query, to_set, (err, res) => {
			if (err) throw err;
			return embed.message(msg.channel, `Removed the role \`${args[0]}\``, "");
		});
	});
}

export function cmd_giveRole(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role id, id of user] give somebody a role.";
    if (modus == "get_permission") return perm.list.admin;
    if (msg == undefined) return;
    if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Role id, id of user]!", "");

	var users = msg.guild?.members.cache.array()
	if (!users) return;
	for (var i in users) {
		if (users[i].id == args[1]) {
			var roles = msg.guild?.roles.cache.array()
			if (!roles) return;
			for (var j in roles) {
				if (roles[j].id == args[0]) {
					var username = users[i].displayName
					var rolename = roles[j].name
					users[i].roles.add(roles[j].id).then(() => {
						return embed.message(msg.channel, `The role \`${rolename}\` was succesfully given to the user \`${username}\`.`, "")
					}).catch((err) => {
						embed.error(msg.channel, `Someting went wrong, please contact the supporter. Error message: \`${err}\``, "")
					}) 
					return
				}
			}
			return embed.error(msg.channel, `There is no role with the id \`${args[0]}\` on this server.`, "")
		}
	}
	return embed.error(msg.channel, `There is no user with the id \`${args[1]}\` on this server.`, "")
}

export function cmd_removeRole(msg: Discord.Message | undefined, args: Array<string> | undefined, modus: string | undefined) {
    if (modus == "get_description") return "[Role id, id of user] remoe a role from somebody.";
    if (modus == "get_permission") return perm.list.admin;
    if (msg == undefined) return;
    if (args == undefined || args.length != 2) return embed.error(msg.channel, "You need to specify two arguments [Role id, id of user]!", "");
	
	var users = msg.guild?.members.cache.array()
	if (!users) return
	for (var i in users) {
		if (users[i].id == args[1]) {
			var roles = users[i].roles.cache.array()
			if (!roles) return embed.error(msg.channel, `The user with the id \`${args[1]}\` has no roles on this server!`, "")
			for (var j in roles) {
				if (roles[j].id == args[0]) {
					var username = users[i].displayName
					var rolename = roles[j].name
					users[i].roles.remove(roles[j].id).then(() => {
						return embed.message(msg.channel, `The role \`${rolename}\` was succesfully removed from the user \`${username}\`.`, "")
					}).catch((err) => {
						embed.error(msg.channel, `Someting went wrong, please contact the supporter. Error message: \`${err}\``, "")
					}) 
					return
				}
			}
			return embed.error(msg.channel, `There is no role with the id \`${args[1]}\` on this server.`, "")
		}
	}
	return embed.error(msg.channel, `There is no user with the id \`${args[1]}\` on this server.`, "")
}
