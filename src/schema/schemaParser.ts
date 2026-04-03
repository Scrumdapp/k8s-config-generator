import {createRootNode, SchemaNode} from "@src/schema/schemaNode";

export function parseSchema(schema: any): SchemaNode {
    if (typeof schema !== "object") {
        throw new Error("Schema must be of type object")
    }

    if (schema.hasOwnProperty("_type")) {
        throw new Error("Schema cannot have a _type value")
    }

    if (Object.keys(schema) == 0) {
        throw new Error("Schema node cannot be empty")
    }

    const node = createRootNode()
    node.type.build(schema, node)
    return node;
}