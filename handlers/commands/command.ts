import BotEnv from "../../botenv.ts";
import config from "../../config.ts";
import { Message, Member } from "../../deps.ts";
export interface Command {
    (botEnv: BotEnv, author: Member, message: Message): Promise<void>;
}

export const argsParser = (string: string): string[] => {
    const rawSplit = string.split(" ");

    const next = rawSplit.slice(1).reduce(
        (acc, curr) => {
            if (acc.length == 0) return [curr];
            const head = acc.slice(0, -1);
            const tail = acc.slice(-1)[0];
            if (tail.startsWith('"') && !tail.endsWith('"'))
            {
                return head.concat(tail.concat(" ", curr));
            }
            return acc.concat(curr);
        }, [] as string[]);
    const fullList = [RegExp(`(?<=^${config.prefix}).*`).exec(rawSplit[0])![0]].concat(next);
    return fullList.map(arg => (RegExp(`((?<=^").*(?="$))`).exec(arg) || [arg])[0]);
}