import { MongoClient } from "mongodb";
import * as main from "./main";

export function isServerKnown(server_id: string | undefined, callback: (found: boolean) => void) {
	main.db.collection("servers").find({}).toArray((err, res) => {
		if (err) throw err;
		for (var i in res) {
			if (res[i].id == server_id) {
				callback(true);
				return;
			}
		}
		callback(false);
	});
}

export function add_server_to_db(server_id: string | undefined, callback: () => void) {
	var to_add = { id: server_id, users: [], roles_to_manage: []};
	main.db.collection("servers").insertOne(to_add, (err, res) => {
		if (err) throw err;
		console.log("[Database] added new Server to database");
		callback();
	});
}

export function isUserKnown(user_id: string | undefined, server_id: string | undefined, callback: (found: boolean) => void) {
	var query = { id: server_id};
	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		for (var i in res.users) {
			if (res.users[i].id == user_id) {
				callback(true);
				return;
			}
		}
		callback(false);
	});
}

export function getUser(user_id: string | undefined, server_id: string | undefined, callback: (user: main.User | undefined) => void) {
	var query = { id: server_id};
	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		for (var i in res.users) {
			if (res.users[i].id == user_id) {
				callback(res.users[i]);
				return;
			}
		}
		callback(undefined);
	});
}

export function add_new_user_to_db(user_id: string | undefined, user_permission: number, server_id: string | undefined, callback: () => void) {
	var query = { id: server_id };
	main.db.collection("servers").findOne(query, (err, res) => {
		if (err) throw err;
		res.users.push({
			id: user_id,
			permission: user_permission
		});
		var to_update = { $set: { users: res.users} };
		main.db.collection("servers").updateOne(query, to_update, (err, res) => {
			if (err) throw err;
			console.log("[Database] added one new user to the database");
			callback();
			return;
		});
	});
}

export function debug_log_complete_db() {
	main.db.collection("servers").find({}).toArray((err, res) => {
		if (err) throw err;
		console.log("DEBUG: complete db debug log: " + JSON.stringify(res));
	});
}
