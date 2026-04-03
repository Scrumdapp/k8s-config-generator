import YAML from "yaml";
import {createRootNode, SchemaNode} from "@src/schema/schemaNode";
import { schemaTypes } from "@src/schema/schemaTypes";


export function parseYaml(yaml: string) {
    return YAML.parse(yaml)
}

export function parseSchema(schema: any): SchemaNode {
    if (typeof schema !== "object") {
        throw new Error("Schema must be of type object")
    }

    if (schema.hasOwnProperty("_type")) {
        throw new Error("Root node cannot have a type value")
    }

    const node = createRootNode()

    node.type.build(node, schema)

    return node;
}