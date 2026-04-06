import {CommandNode} from "./commandNode";
import {CommandContext} from "./commandContext";

export interface CommandType {
    cmd: string,
    build: (schema: any, node: CommandNode) => void
    run: (ctx: CommandContext, node: CommandNode) => void
}