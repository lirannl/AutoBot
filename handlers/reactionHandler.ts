import BotEnv from "../botenv.ts";
import config from "../config.ts";
import { eventHandlers, addReaction, Message, Member, removeReaction, ReactionPayload } from "../deps.ts";
import { performantMultiOr } from "../utils.ts";

const mirror = async ({ reactionMirrorBindings }: BotEnv, message: Message, emoji: ReactionPayload, reacter: Member, type: "add" | "remove") => {
    // Ensure that the reacter has one of the required roles
    if (!performantMultiOr(
        config.reactionMirroringRoles.map(roleName => reacter.roles.includes(roleName))
    )) return;
    const binding = reactionMirrorBindings.find(({ source }) => message.id == source.id);
    if (binding && binding) {
        const operation = type == "add" ? addReaction : removeReaction;
        operation(binding.target.channelID, binding.target.id, emoji.id || emoji.name!);
    }
}

export default (botEnv: BotEnv, type: "add" | "remove"): typeof eventHandlers.reactionAdd | typeof eventHandlers.reactionRemove =>
    async (message, emoji, reactorID) => {
        const reactor = botEnv.guild.members.find(f => f.user.id == reactorID)!;
        mirror(botEnv, message as Message, emoji, reactor, type);
    };