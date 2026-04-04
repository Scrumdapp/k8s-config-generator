import {CommandType} from "@src/command/commandType";
import {commandContainer} from "@src/command/commands/commandContainer";

export interface CommandNode {
    data: { [key: string]: any }
    command: CommandType
}

export function createCommandNode(command: CommandType): CommandNode {
    return {
        data: {},
        command: command
    }
}

export function createCommandContainer(schema: any): CommandNode {
    const node = createCommandNode(commandContainer);
    commandContainer.build(schema, node)
    return node;
}
