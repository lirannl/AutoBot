import BotEnv from "../botenv.ts";
import { config } from "../deps.ts";
import { eventHandlers, Message, cache } from "../deps.ts";
import { nameToRole, performantMultiOr } from "../utils.ts";
import commands from "./commands/index.ts";


// Tests a message against constraints to determine if at least one is true
const checkConstraints: (msg: Message) => boolean = (msg) => {
    const constraints: boolean[] = [
        msg.content.startsWith(config.prefix)
    ];

    return performantMultiOr(constraints);
}

export default (botEnv: BotEnv): typeof eventHandlers.messageCreate => async (msg) => {
    const guild = cache.guilds.get(config.guildID)!;
    const author = guild.members.find(member => member.user.id == msg.author.id);
    if (checkConstraints(msg) && author) {
        const command = msg.content.split(" ")[0].slice(1);
        if (commands[command]) await commands[command](botEnv, author, msg);
    }
}