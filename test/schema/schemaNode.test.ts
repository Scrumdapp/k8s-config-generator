import {createRootNode, createSchemaNode} from "../../src/schema/schemaNode";
import {objectType} from "../../src/schema/schemaTypes/objectType";

describe("Check validities of schema node type and creation", () => {

    test("Creation of root schema node", () => {
        const node = createRootNode();
        expect(node.path).toBe("")
        expect(node.data).toEqual({})
        expect(node.name).toBe("_schema")
    })

    test("Creation of a new node", () => {
        const root = createRootNode()
        const schemaNode = createSchemaNode(root, objectType, "bob")
        expect(schemaNode.name).toBe("bob")
        expect(schemaNode.path).toBe("bob")
        expect(schemaNode.type).toBe(objectType)
        expect(schemaNode.data).toEqual({})
    })
})