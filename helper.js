module.exports = {
    isServerKnown(serverID, servers) {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i].id == serverID) return i;
        }
        return undefined;
    },
    isUserKnown(userID, users) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == userID) return i;
        }
        return undefined;
    },
};
