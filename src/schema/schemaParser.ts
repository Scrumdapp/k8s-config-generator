import { createRootNode, SchemaNode } from "./schemaNode";
import { CommandContext } from "../command/commandContext";

export function parseSchema(schema: any): SchemaNode {
    if (typeof schema !== "object") {
        throw new Error("Schema must be of type object")
    }

    if (schema.hasOwnProperty("_type")) {
        throw new Error("Schema cannot have a _type value")
    }

    if (Object.keys(schema).length == 0) {
        throw new Error("Schema node cannot be empty")
    }

    const node = createRootNode()
    node.type.build(schema, node)
    return node;
}

export function readSchemaValues(values: any, schemaNode: SchemaNode): CommandContext {
    if (typeof values !== "object") {
        throw new Error("Schema values must be of type object")
    }

    const object = schemaNode.type.parseValue(values, schemaNode)
    if (typeof object !== "object") {
        throw new Error("Error parsing schema values: must be of type object")
    }

    const ctx = new CommandContext();
    convertObject(ctx, "", object)

    return ctx;
}

export function convertObject(ctx: CommandContext, path: string, object: { [key: string]: any }) {
    for (let key in object) {
        const value = object[key]
        const p = path == "" ? key : `${path}.${key}`
        convertValue(ctx, p, value)
    }
}

export function convertArray(ctx: CommandContext, path: string, object: any[]) {
    ctx.setValue(path == "" ? "length" : `${path}.length`, object.length)

    for (let i = 0; i < object.length; i++) {
        const value = object[i]
        const p = `${path}[${i}]`
        convertValue(ctx, p, value)
    }
}

export function convertValue(ctx: CommandContext, path: string, value: any) {
    ctx.setValue(path, value)

    if (typeof value === "object" && !(value instanceof Array)) {
        convertObject(ctx, path, value)
    } else if (typeof value === "object" && value instanceof Array) {
        convertArray(ctx, path, value)
    }
}
