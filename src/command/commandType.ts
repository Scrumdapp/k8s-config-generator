import {CommandNode} from "@src/command/commandNode";
import {CommandContext} from "@src/command/commandContext";


export interface CommandType {
    cmd: string,
    build: (schema: any, node: CommandNode) => void
    run: (ctx: CommandContext, node: CommandNode) => void
}