import * as perm from "../permissions";
import * as Discord from "discord.js";
import * as main from "../main";
import * as embed from "./embed";

export function cmd_giveRoleSelf(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Give yourself a role.",
			args: [
				{name: "Name of the role", type: [main.args_types.text_with_spaces]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined) return;
	var query = { id: msg.guild?.id };

	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		if (res.roles_to_manage.length == 0) return embed.info(msg.channel, "There are no roles I can manage on this server.", "");
		for(var i in res.roles_to_manage) {
			if (res.roles_to_manage[i].name == args.join(' ')) {
				var role = msg.guild?.roles.cache.find(role => role.name == res.roles_to_manage[i].name);
				if (role != undefined)  {
					msg.member?.roles.add(role).then(() => {
						return embed.message(msg.channel, `The role ${args.join(' ')} was succesfully given to you.`, "");
					}).catch((err) => {
							main.catch_err(err, msg)
							return
					}) 
				} else {
					return embed.error(msg.channel, `The role ${args.join(' ')} does not exist anymore on this server! Pleas delete it out of my list with \`${main.config.prefix}remove_managed_role\``, "");
				}
				return 			
			}
		}
		return embed.error(msg.channel, `I cant manage the role ${args.join(' ')}!`, "");
	});
}

export function cmd_removeRoleSelf(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Remove a role from yourself.",
			args: [
				{name: "Name of the role", type: [main.args_types.text_with_spaces]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined) return;
	var query = { id: msg.guild?.id };

	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		if (res.roles_to_manage.length == 0) return embed.info(msg.channel, "There are no roles I can manage on this server.", "");
		for(var i in res.roles_to_manage) {
			if (res.roles_to_manage[i].name == args.join(' ')) {
				var role = msg.guild?.roles.cache.find(role => role.name == res.roles_to_manage[i].name);
				if (role != undefined)  {
					var has_role = msg.member?.roles.cache.each(role => role.name == args.join(' '));
					if (has_role != undefined) {
						msg.member?.roles.remove(role.id).then(() => {
							return embed.message(msg.channel, `The role ${args.join(' ')} was succesfully removed from you.`, "");
						}).catch((err) => {
							main.catch_err(err, msg)
							return
						}) 
						return
					} else {
						return  embed.error(msg.channel, `You dont have the role ${args.join(' ')}.`, "");
					}
				} else {
					return embed.error(msg.channel, `The role ${args.join(' ')} does not exist anymore on this server! Pleas delete it out of my list with \`${main.config.prefix}remove_managed_role\``, "");
				}
			}
		}
		return embed.error(msg.channel, `I cant manage the role ${args.join(' ')}!`, "");
	});
}

export function cmd_list_roles(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.none,
			description: "Get a list of all available roles.",
			args: []
		}
	}

    if (msg == undefined) return;
    if (args == undefined || args.length != 0) return;
	
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

export function cmd_addManagedRole(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.manage_roles,
			description: "Add a role that I can manage.",
			args: [ 
				{ name: "Name of the role", type: [main.args_types.text_with_spaces]}
			]
		}
	}

    if (msg == undefined) return;	
	if (args == undefined) return;

	var role = msg.guild?.roles.cache.find(role => role.name == args.join(' '));
	console.log(role);
	if (role == undefined) {
		return embed.error(msg.channel, `There is no role named \`${args.join(' ')}\`.\n Tipp: you have to create the role manually and then add it to my managed roles.`, "");
	} else {
		var query = { id: msg.guild?.id }
		main.db.collection("servers").findOne(query, (err, res) => {
			if (err) throw err;
			for (var i in res.roles_to_manage) {
				if (res.roles_to_manage[i].name == role?.name) {
					return embed.info(msg.channel, `The role \`${args.join(' ')}\` is already added.`, "");
				}
			}
			res.roles_to_manage.push({ id: role?.id, name: role?.name});
			var to_set = { $set: { roles_to_manage: res.roles_to_manage}}
			main.db.collection("servers").updateOne(query, to_set, (err, res) => {
				if (err) throw err;
				return embed.message(msg.channel, `Added the role \`${args.join(' ')}\``, "");
			});
		});
	}
}

export function cmd_removeManagedRole(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.manage_roles,
			description: "Remove a role that has been added.",
			args: [ 
				{ name: "Name of the role", type: [main.args_types.text_with_spaces]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined) return;

	var query = { id: msg.guild?.id }
	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		var found = "-1";
		for (var i in res.roles_to_manage) {
			if (res.roles_to_manage[i].name == args.join(' ')) {
				found = i;
				break;
			}
		}
		if (found == "-1"){
			return embed.info(msg.channel, `The role \`${args.join(' ')}\` is already added.`, "");
		}

		res.roles_to_manage.splice(found, 1);
		var to_set = { $set: { roles_to_manage: res.roles_to_manage}}
		main.db.collection("servers").updateOne(query, to_set, (err, res) => {
			if (err) throw err;
			return embed.message(msg.channel, `Removed the role \`${args.join(' ')}\``, "");
		});
	});
}

export function cmd_giveRole(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.admin,
			description: "Give somebody a role.",
			args: [ 
				{ name: "Id of the role", type: [main.args_types.number]},
				{ name: "Id of the user", type: [main.args_types.number]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined || args.length != 2) return;

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
						main.catch_err(err, msg)
						return
					}) 
					return
				}
			}
			return embed.error(msg.channel, `There is no role with the id \`${args[0]}\` on this server.`, "")
		}
	}
	return embed.error(msg.channel, `There is no user with the id \`${args[1]}\` on this server.`, "")
}

export function cmd_removeRole(msg: Discord.Message | undefined, args: Array<string> | undefined, getInfo: boolean | undefined) {
	if (getInfo) {
		return {
			permission: perm.list.admin,
			description: "Remove a role from somebody.",
			args: [ 
				{ name: "Id of the role", type: [main.args_types.number]},
				{ name: "Id of the user", type: [main.args_types.number]}
			]
		}
	}

    if (msg == undefined) return;
    if (args == undefined || args.length != 2) return;
	
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
						main.catch_err(err, msg)
						return	
					}) 
					return
				}
			}
			return embed.error(msg.channel, `There is no role with the id \`${args[1]}\` on this server.`, "")
		}
	}
	return embed.error(msg.channel, `There is no user with the id \`${args[1]}\` on this server.`, "")
}
