import { PermList } from "../permissions";
import * as Discord from "discord.js"


export function cmd_addPermission(msg:any, args:any, modus:any) {
    if (modus == "get_description") return "[userID, name of permission to add] add permission to other users.";
    if (modus == "get_permission") return PermList.managePermissions;
    console.log(args);
}
