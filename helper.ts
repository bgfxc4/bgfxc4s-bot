import { PermList } from "./permissions";
import * as main from "./main"

export function isServerKnown(serverID:string, servers:Array<main.Server>) {
    for (var i = 0; i < servers.length; i++) {
        if (servers[i].id == serverID) return i;
    }
    return undefined;
}

export function isUserKnown(userID:string | undefined, users:Array<main.User>) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userID) return true;
    }
    return undefined;
}

export function hasPermissions(user:main.User | undefined, neededPermission:number) {
    if(!user) return undefined;
    if ((user.permission & PermList.admin) == PermList.admin) return true;
    return (user.permission & neededPermission) == neededPermission;
}

export function getUser(id:string | undefined, server:main.Server) {
    for (var user of server.users) {
        if (user.id == id) return user;
    }
    return undefined;
}
