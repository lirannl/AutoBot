import BotEnv from "../../botenv.ts";
import { Message, Member } from "../../deps.ts";

export interface Command {
    (botEnv: BotEnv, author: Member, message: Message): Promise<void>;
}