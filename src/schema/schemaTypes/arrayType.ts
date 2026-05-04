import { SchemaType, setBooleanFlagIfExists, setStringFlagIfExists } from "../schemaType";
import { getSchemaType } from "../schemaTypes";
import { createSchemaNode, SchemaNode } from "../schemaNode";
import { assertPresentWithRequired } from "../schemaUtils";

export const arrayType: SchemaType = {
    name: "array",
    build: (schema, node) => {
        if (typeof schema === "string") {
            throw new Error(`${node.path}: Array cannot be declared inline`)
        }

        if (!schema.hasOwnProperty("item")) {
            throw new Error(`${node.path}: Items field must be declared`)
        }

        setBooleanFlagIfExists(schema, "required", node)

        const itemType = getSchemaType(schema.item)
        const schemaNode = createSchemaNode(node, itemType, schema.item)
        itemType.build(schema.item, schemaNode)

        node.data.itemNode = schemaNode

        setStringFlagIfExists(schema, "default", node)
    },
    parseValue: (obj, node) => {
        if (!assertPresentWithRequired(obj, node, it => obj = it)) {
            return undefined
        }

        if (typeof obj !== "object" || !(obj instanceof Array)) {
            throw new Error(`${node.path}: Value must be of type array`)
        }

        const itemNode = node.data.itemNode as SchemaNode

        const r: any[] = [];
        for (let i = 0; i < obj.length; i++) {
            r.push(itemNode.type.parseValue(obj[i], itemNode))
        }

        return r;
    }
}
