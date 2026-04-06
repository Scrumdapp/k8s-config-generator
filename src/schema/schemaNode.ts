import {SchemaType} from "./schemaType";
import {schemaTypes} from "./schemaTypes";

export type DataType = { [key: string]: any }

export interface SchemaNode {
    name: string,
    path: string,
    data: DataType,
    type: SchemaType
}

export function createSchemaNode(parent: SchemaNode, type: SchemaType, name: string) {
    const path = parent.path == "" ? name : `${parent.path}.${name}`

    const node: SchemaNode = {
        name: name,
        path: path,
        data: {},
        type: type
    }

    return node
}

export function createRootNode(): SchemaNode {
    return {
        name: "_schema",
        path: "",
        data: {},
        type: schemaTypes.get("object")!!
    };
}