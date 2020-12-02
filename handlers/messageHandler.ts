import BotEnv from "../botenv.ts";
import { config } from "../deps.ts";
import { eventHandlers, Message, cache } from "../deps.ts";
import { nameToRole, performantMultiOr } from "../utils.ts";
import roleCategoryHandler from "./roleCategoryHandler.ts";
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
    if (msg.channelID == config.dynoChannel && msg.author.username == "Dyno" && msg.author.discriminator == "0000")
    {
        const eventContent = msg.embeds[0].description!;
        if (RegExp("was (given|removed from) the").test(eventContent))
        {
            const member = guild.members.get(RegExp("(?<=<@!)([0-9]+)(?=>)").exec(eventContent)![0])!;
            const role = nameToRole(guild, RegExp("(?<=the `)(.*)(?=` role)").exec(eventContent)![0])!;
            await roleCategoryHandler(eventContent.includes("given") ? "add" : "remove")(guild, member, role.id);
        }
    }
    if (checkConstraints(msg) && author) {
        const command = msg.content.split(" ")[0].slice(1);
        if (commands[command]) await commands[command](botEnv, author, msg);
    }
}