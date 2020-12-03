
import { Guild, Role, Member, cache } from "./deps.ts";

export const removeFalses = <T>(arrWithNulls: (T | null | undefined)[]): T[] => arrWithNulls.filter(e => e) as T[];

export const nameToRole = (guild: Guild, roleName: string): Role | undefined => guild.roles.find((role => RegExp(roleName, "i").test(role.name)));

export const sleep = (seconds: number) => new Promise<void>(resolve => {
    setTimeout(()=> {resolve()}, 1000 * seconds);
});

export const memberHasRoles = (member: Member, roles: string[]) => {
    const guild = cache.guilds.get(member.guildID)!;
    const allowedRoles = roles.map(roleName => nameToRole(guild, roleName)!.id);
    return member.roles.some(roleID => allowedRoles.includes(roleID));
}

export const performantMultiOr = (conditions: boolean[]) => {
    let result = false;
    for (const condition of conditions) {
        result ||= condition;
        if (result) break;
    }
    return result;
}

export function reversedArray<T>(arr: T[]): T[] {
    return arr.reduce((acc, curr) => [curr].concat(acc),[] as T[]);
}