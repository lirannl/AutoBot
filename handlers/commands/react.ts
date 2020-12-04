import BotEnv from "../../botenv.ts";
import config from "../../config.ts";
import { memberHasRoles, nameToRole, performantMultiOr } from "../../utils.ts";
import { Message, Member, getMessage, deleteMessage } from "../../deps.ts";

const msToLive = 60 * 1000;

// Add a new reaction mirror binding
export default async ({ guild, reactionMirrorBindings }: BotEnv, invoker: Member, message: Message) => {
    if (!message.referencedMessageID) return;
    if (!memberHasRoles(invoker, config.reactionMirroringRoles)) {
        await deleteMessage(message); return;
    }
    // Remove message once stale
    setTimeout(() => { deleteMessage(message); }, msToLive);
    // Create a new binding
    reactionMirrorBindings.push(
        {
            source: message, target: await getMessage(message.channelID, message.referencedMessageID!.id),
            bindTime: new Date()
        }
    );
    // Clean stale bindings by removing all bindings older than msToLive
    reactionMirrorBindings = reactionMirrorBindings.filter(binding => Date.now() - binding.bindTime.valueOf() <= msToLive);

}