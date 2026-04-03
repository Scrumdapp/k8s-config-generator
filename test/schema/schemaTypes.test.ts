import "../../src/schema/schemaTypes"
import {createRootNode, createSchemaNode, SchemaNode} from "../../src/schema/schemaNode";
import {objectType} from "../../src/schema/schemaTypes/objectType";
import {numberType} from "../../src/schema/schemaTypes/numberType";
import {stringType} from "../../src/schema/schemaTypes/stringType";

describe("Parsing of different types", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, objectType, "obj")
    })

    test.each([
        ["number", numberType],
        ["string", stringType]
    ])("parse inline type %p", (name, type) => {
        objectType.build({ v: name }, node)
        const children = node.data.children as SchemaNode[]
        expect(children[0].type).toBe(type)
    })

    test.each([
        ["number", numberType],
        ["string", stringType]
    ])("parse type %p", (name, type) => {
        objectType.build({ v: { _type: name } }, node)
        const children = node.data.children as SchemaNode[]
        expect(children[0].type).toBe(type)
    })

    test("inferred object typing", () => {
        objectType.build({ v: { num: "number" }}, node)
        const children = node.data.children as SchemaNode[]
        expect(children[0].type).toBe(objectType)
        expect(children[0].data.children[0].type).toBe(numberType)
    })

    test("declared object typing", () => {
        expect(() => objectType.build({ v: { _type: "object", num: "number" }}, node))
    })

    test("declared inline object typing", () => {
        expect(() => objectType.build({ v: "object" }, node))
    })
})