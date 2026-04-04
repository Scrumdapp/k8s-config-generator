import {CommandNode} from "@src/command/commandNode";

export function assert(node: CommandNode, message: string, fn: () => boolean) {
    if (fn()) {
        return
    }

    throw new Error(`${node.command.cmd}: ${message}`)
}

export function getSchemaValue(node: CommandNode, schema: any, name: string) {
    if (!schema.hasOwnProperty(name)) {
        throw new Error(`Cmd ${node.command.cmd} is missing property '${name}'`)
    }

    return name
}

export function getNumberValue(node: CommandNode, name: string) {
    if (!node.data.hasOwnProperty(name)) {
        throw new Error(`${node.command.cmd}: command does not have property '${name}'`)
    }

    if (typeof node.data[name] != "number") {
        throw new Error(`${node.command.cmd}: command does not have property '${name}'`)
    }

    return node.data[name]
}

export function getStringValue(node: CommandNode, name: string) {
    if (!node.data.hasOwnProperty(name)) {
        throw new Error(`${node.command.cmd}: command does not have property '${name}'`)
    }

    return node.data[name].toString()
}
