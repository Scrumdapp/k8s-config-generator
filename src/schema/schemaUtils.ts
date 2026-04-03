import {SchemaNode} from "@src/schema/schemaNode";

export function withValueOrSkip<T>(node: SchemaNode, name: string, fn: (value: T) => void) {
    if (!node.data.hasOwnProperty(name)) {
        return
    }

    fn(node.data[name])
}

export function assert(node: SchemaNode, message: string, fn: () => boolean) {
    if (fn()) return
    throw new Error(`${node.path}: ${message}`)
}

export function notPresent(value: any) {
    return value == null || typeof value === "undefined"
}

export function assertPresentWithRequired(value: any, node: SchemaNode) {
    if (notPresent(value)) {
        if (node.data.required === true) {
            throw new Error(`field '${node.path}' is required but was not present`)
        }
        return false
    }
    return true
}