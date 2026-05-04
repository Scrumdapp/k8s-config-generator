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

        let items: any = null

        if (schema instanceof Array) {
            if (schema.length !== 1) {
                throw new Error(`${node.path}: Implicit array declaration only allows 1 item`)
            }
            items = schema[0]
        } else {
            setBooleanFlagIfExists(schema, "required", node)
            if (!schema.hasOwnProperty("item")) {
                throw new Error(`${node.path}: Items field must be declared`)
            }
            items = schema.item
        }

        const itemType = getSchemaType(items)
        const schemaNode = createSchemaNode(node, itemType, items)
        itemType.build(items, schemaNode)

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
