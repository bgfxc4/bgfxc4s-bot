import * as main from "./main";

export function isServerKnown(serverID: string, servers: Array<main.Server>) {
    for (var i = 0; i < servers.length; i++) {
        if (servers[i].id == serverID) return i;
    }
    return undefined;
}

export function isUserKnown(userID: string | undefined, users: Array<main.User> | undefined) {
    if (users == undefined) return console.log("helper.ts: is user known: users is undefined");
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userID) return true;
    }
    return undefined;
}

export function getUser(id: string | undefined, server: main.Server | undefined) {
    if (!server) return;
    for (var i in server.users) {
        if (server.users[i].id == id) {
            return server.users[i];
        }
    }
    return undefined;
}

export function getServer(id: string | undefined) {
    for (var server of main.servers) {
        if (server.id == id) return server;
    }
    return undefined;
}
