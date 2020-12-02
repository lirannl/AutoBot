import config from "../config.ts";
import { Role, eventHandlers, addRole, removeRole, Guild, Member } from "../deps.ts";
import { nameToRole, removeFalses, sleep } from "../utils.ts";

function roleCategoryHandler(operation: "add" | "remove") {
    return async (guild: Guild, member: Member, roleID: string) => {
        const role: Role = guild.roles.get(roleID)!;

        const categoryName = (Object.entries(config.roleCategories)
            .find(e => e[1].find(innerRoleName => RegExp(role.name, 'i').test(innerRoleName))) || [])[0];
        await sleep(0.1);
        if (!categoryName) return; // If the role doesn't belong to any category stop running this function
        const category = nameToRole(guild, categoryName)!;
        if (operation == "add" && !member.roles.includes(category.id)) {
            await addRole(guild.id, member.user.id, category.id);
        }
        else if (operation == "remove") {
            const rolesInCategory = removeFalses(config.roleCategories[categoryName].map((roleName) => nameToRole(guild, roleName)));
            const remainingRoles = rolesInCategory.filter(role=>member.roles.includes(role.id));
            if (remainingRoles.length == 0 || (remainingRoles.length == 1 && remainingRoles[0].id == role.id)) {
                await removeRole(guild.id, member.user.id, category.id);
            }
        }
    };
}

export default roleCategoryHandler;