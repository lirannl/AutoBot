import config from "../config.ts";
import { Role, eventHandlers, addRole, removeRole, Guild, Member } from "../deps.ts";
import { nameToRole, removeFalses, reversedArray, sleep } from "../utils.ts";

function roleCategoryHandler(operation: "add" | "remove") {
    return async (guild: Guild, member: Member, roleID: string) => {
        const role: Role = guild.roles.get(roleID)!;

        const categoryName = (Object.entries(config.roleCategories)
            .find(e => e[1].find(innerRoleName => RegExp(role.name, 'i').test(innerRoleName))) || [])[0];
        if (!categoryName) return; // If the role doesn't belong to any category stop running this function
        const category = nameToRole(guild, categoryName)!;
        if (operation == "add" && !member.roles.includes(category.id)) {
            console.log(`Adding ${category.name}`);
            await addRole(guild.id, member.user.id, category.id);
        }
        else if (operation == "remove") {
            const rolesInCategory = removeFalses(config.roleCategories[categoryName].map((roleName) => nameToRole(guild, roleName)));
            console.log(member);
            console.log(member.roles);
            const remainingRoles = rolesInCategory.filter(role=>member.roles.includes(role.id));
            console.log(remainingRoles);
            if (remainingRoles.length == 0 || (remainingRoles.length == 1 && remainingRoles[0].id == role.id)) {
                console.log(`Removing ${category.name}`);
                await removeRole(guild.id, member.user.id, category.id);
            }
        }
    };
}

export default roleCategoryHandler;