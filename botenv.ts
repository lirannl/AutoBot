import { Guild, Message } from "./deps.ts";
export default interface BotEnv {
    guild: Guild,
    reactionMirrorBindings: { source: Message, target: Message, bindTime: Date}[]
}