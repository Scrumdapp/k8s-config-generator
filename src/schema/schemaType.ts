import {DataType, SchemaNode} from "@src/schema/schemaNode";


export interface SchemaType {
    name: string
    build: (schema: any, node: SchemaNode) => void
    parseValue: (value: any, node: SchemaNode) => any
}

export function setNumberFlagIfExists(schema: any, value: string, node: SchemaNode) {
    if (!schema.hasOwnProperty(value)) {
        return false;
    }

    const v = schema[value]
    if (typeof v !== "number") {
        throw new Error(`Flag '${value}' of field '${node.path}' is not a number`)
    }

    node.data[value] = v;
    return true
}

export function setStringFlagIfExists(schema: any, value: string, node: SchemaNode) {
    if (!schema.hasOwnProperty(value)) {
        return false;
    }

    const v = schema[value]
    if (typeof v !== "string") {
        throw new Error(`Flag '${value}' of field '${node.path}' is not a string`)
    }

    node.data[value] = v;
    return true
}

export function setBooleanFlagIfExists(schema: any, value: string, node: SchemaNode) {
    if (!schema.hasOwnProperty(value)) {
        return false;
    }

    const v = schema[value]
    if (typeof v !== "boolean") {
        throw new Error(`Flag '${value}' of field '${node.path}' is not a boolean`)
    }

    node.data[value] = v;
    return true
}