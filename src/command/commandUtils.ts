import {CommandNode} from "@src/command/commandNode";
import {CommandContext} from "@src/command/commandContext";
import {tokenizeLine} from "@src/textProcessing/tokenizer";
import {processLine} from "@src/textProcessing/processLine";

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

    return schema[name]
}

export function getNumberValue(ctx: CommandContext, node: CommandNode, name: string) {
    if (!node.data.hasOwnProperty(name)) {
        throw new Error(`${node.command.cmd}: command does not have property '${name}'`)
    }

    let v = node.data[name]
    if (typeof v === "string") {
        const out = processLine(ctx, tokenizeLine(v))
        v = parseFloat(out)
    }

    if (typeof v !== "number") {
        throw new Error(`${node.command.cmd}: property '${name}' was not parsed to a number`)
    }

    if (isNaN(v)) {
        throw new Error(`${node.command.cmd}: property '${name}' resolved to NaN`)
    }

    return v
}

export function getStringValue(ctx: CommandContext, node: CommandNode, name: string) {
    if (!node.data.hasOwnProperty(name)) {
        throw new Error(`${node.command.cmd}: command does not have property '${name}'`)
    }

    const v = node.data[name]
    if (typeof v === "string") {
        return processLine(ctx, tokenizeLine(v))
    }

    return v == null ? "null" : v.toString()
}
