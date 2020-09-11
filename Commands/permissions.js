const perm = require("../permissions");
module.exports = {
    cmd_addPermission(msg, args, modus) {
        if (modus == "get_description") return "[userID, name of permission to add] add permission to other users.";
        if (modus == "get_permission") return perm.list.managePermissions;
        console.log(args);
    },
};
