import {CommandNode, createCommandContainer, createCommandNode} from "@src/command/commandNode";
import {getCommandType} from "@src/command/commandTypes";

export function parseCommands(schema: any): CommandNode {
    return createCommandContainer(schema);
}

export function parseCommand(schema: any): CommandNode {
    const type = getCommandType(schema)
    const node = createCommandNode(type)
    type.build(schema, node)
    return node
}