import BotEnv from "../../botenv.ts";
import config from "../../config.ts";
import { Member, Message, sendMessage } from "../../deps.ts";
import { memberHasRoles, nameToRole } from "../../utils.ts";
import { argsParser } from "./command.ts";

export default async ({ guild }: BotEnv, invoker: Member, message: Message) => {
    if (!memberHasRoles(invoker, config.roleCategoryManagerRoles)) return;
    const args = argsParser(message.content);
    if (args.length < 2) {
        await sendMessage(message.channelID, {content: "Sorry, you must specify a category.", replyMessageID: message.id});
    }
    else if (args.length == 2) {
        const { [args[1]]: _, ...rest } = config.roleCategories;
        config.roleCategories = rest;
    }
    else {
        const newCategories = Object.assign({}, config.roleCategories, {[args[1]]: args.slice(2)});
        config.roleCategories = newCategories;
    }
}