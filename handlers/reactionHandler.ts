import BotEnv from "../botenv.ts";
import config from "../config.ts";
import { eventHandlers, addReaction, Message, Member, removeReaction, ReactionPayload } from "../deps.ts";
import { memberHasRoles, performantMultiOr } from "../utils.ts";

const mirror = async ({ reactionMirrorBindings }: BotEnv, message: Message, emoji: ReactionPayload, reacter: Member, type: "add" | "remove") => {
    if (!memberHasRoles(reacter, config.reactionMirroringRoles)) return;
    const binding = reactionMirrorBindings.find(({ source }) => message.id == source.id);
    if (binding && binding) {
        const operation = type == "add" ? addReaction : removeReaction;
        operation(binding.target.channelID, binding.target.id, emoji.id || emoji.name!);
    }
}

export default (botEnv: BotEnv, type: "add" | "remove"): typeof eventHandlers.reactionAdd | typeof eventHandlers.reactionRemove =>
    async (message, emoji, reactorID) => {
        const reactor = botEnv.guild.members.find(f => f.user.id == reactorID)!;
        await mirror(botEnv, message as Message, emoji, reactor, type);
    };