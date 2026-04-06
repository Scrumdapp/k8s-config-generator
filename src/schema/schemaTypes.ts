import {SchemaType} from "@src/schema/schemaType";
import {objectType} from "@src/schema/schemaTypes/objectType";
import {numberType} from "@src/schema/schemaTypes/numberType";
import {stringType} from "@src/schema/schemaTypes/stringType";
import {nameType} from "@src/schema/schemaTypes/nameType";
import {dockerImageType} from "@src/schema/schemaTypes/dockerImageType";

export const schemaTypes = new Map<string, SchemaType>()

export function getSchemaType(schema: any): SchemaType {
    let type: string = "null"
    if (typeof schema === "string") {
        type = schema
    } else if (typeof schema === "object") {
        type = schema.hasOwnProperty("_type") ? schema._type : "object"
    } else {
        throw new Error("Schema node must be an string or object")
    }

    if (type === "null") {
        throw new Error("Could not resolve schema type")
    }

    if (type === "object" && typeof schema !== "object") {
        throw new Error("'object' type is special and can only be inferred")
    }

    if (type === "object" && schema.hasOwnProperty("_type")) {
        throw new Error("'object' type is special and can only be inferred")
    }

    const st = schemaTypes.get(type)
    if (!st) {
        throw new Error(`Schema type '${type}' does not exist`)
    }

    return st
}

function addTypes() {
    addSchemaType(objectType)
    addSchemaType(numberType)
    addSchemaType(stringType)
    addSchemaType(nameType)
    addSchemaType(dockerImageType)
}

function addSchemaType(type: SchemaType) {
    if (schemaTypes.has(type.name)) {
        throw new Error(`Schema type '${type.name}' already exists`)
    }

    schemaTypes.set(type.name, type)
}

addTypes()