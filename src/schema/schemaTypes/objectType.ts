import {SchemaType} from "@src/schema/schemaType";
import {getSchemaType} from "@src/schema/schemaTypes";
import {createSchemaNode, SchemaNode} from "@src/schema/schemaNode";
import {assertPresentWithRequired} from "@src/schema/schemaUtils";

export const objectType: SchemaType = {
    name: "object",
    build: (schema, node) => {
        const children: SchemaNode[] = [];

        if (typeof schema === "string") {
            throw new Error(`${node.path}: Object declaration must be inferred`)
        }

        if (schema.hasOwnProperty("_type")) {
            throw new Error(`${node.path}: Object declaration must be inferred`)
        }

        for (const schemaKey in schema) {
            if (schemaKey.startsWith("_")) { continue }

            const v = schema[schemaKey];
            const vType = getSchemaType(v)
            const vNode = createSchemaNode(node, vType, schemaKey)
            vType.build(v, vNode)
            children.push(vNode)
        }

        if (children.length == 0) {
            throw new Error(`${node.path}: Object must not be empty`)
        }

        if (typeof schema._required === "boolean") {
            node.data.required = schema._required
        }

        node.data.children = children;
    },
    parseValue: (obj, node) => {
        if (!assertPresentWithRequired(obj, node)) {
            return undefined
        }

        const children = node.data.children as SchemaNode[]

        const v = {}
        for (let child of children) {
            const value = child.type.parseValue(obj[child.name], child)
            if (typeof value === "undefined") { continue }
            v[child.name] = value
        }

        return v
    }
}