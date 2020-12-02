import BotEnv from "./botenv.ts";
import { DiscordBot, Intents, config, eventHandlers, Guild } from "./deps.ts";
import messageHandler from "./handlers/messageHandler.ts";
import reactionHandler from "./handlers/reactionHandler.ts";
import roleCategoryHandler from "./handlers/roleCategoryHandler.ts";

const botEnv: BotEnv = {
    reactionMirrorBindings: [],
    guild: {} as unknown as Guild
} as BotEnv;

const botLogon = async () => {
    console.log("Connected.");
}

const createEnv: typeof eventHandlers.guildLoaded = (guild) => {
    Object.assign(botEnv.guild, guild);
}

DiscordBot({
    token: config.token,
    intents: [Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILDS, Intents.GUILD_MESSAGE_REACTIONS],
    eventHandlers: {
        ready: botLogon,
        guildLoaded: createEnv,
        messageCreate: messageHandler(botEnv),
        //reactionAdd: reactionHandler(botEnv, "add"),
        //reactionRemove: reactionHandler(botEnv, "remove"),
        roleGained: roleCategoryHandler("add"),
        roleLost: roleCategoryHandler("remove"),
    },
});