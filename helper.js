const perm = require("./permissions");

module.exports = {
    isServerKnown(serverID, servers) {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i].id == serverID) return i;
        }
        return undefined;
    },
    isUserKnown(userID, users) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == userID) return true;
        }
        return undefined;
    },
    hasPermissions(user, neededPermission) {
        if ((user.permission & perm.list.admin) == perm.list.admin) return true;
        return (user.permission & neededPermission) == neededPermission;
    },
    getUser(id, server) {
        for (var user of server.users) {
            if (user.id == id) return user;
        }
        return undefined;
    },
};
