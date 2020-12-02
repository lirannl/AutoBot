
import { Guild, Role, Member, cache } from "./deps.ts";

export const removeFalses = <T>(arrWithNulls: (T | null | undefined)[]): T[] => arrWithNulls.filter(e => e) as T[];

export const nameToRole = (guild: Guild, roleName: string): Role | undefined => guild.roles.find((role => RegExp(roleName, "i").test(role.name)));

export const getMemberRoles = async (member: Member): Promise<Role[]> =>
    removeFalses(member.roles.map(roleID => cache.guilds.get(member.guildID)?.roles.get(roleID) as Role));

export const sleep = (seconds: number) => new Promise<void>(resolve => {
    setTimeout(()=> {resolve()}, 1000 * seconds);
})

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