import "../../../src/schema/schemaTypes"
import {objectType} from "../../../src/schema/schemaTypes/objectType";
import {createRootNode, createSchemaNode, SchemaNode} from "../../../src/schema/schemaNode";

describe("Test the object type", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, objectType, "obj")
    })

    describe("Parsing schema data", () => {
        test("inline declaration throw", () => {
            expect(() => objectType.build("object", node)).toThrow()
        })

        test("declaration throw", () => {
            expect(() => objectType.build({ _type: "object" }, node)).toThrow()
        })

        test("empty object", () => {
            expect(() => objectType.build({}, node)).toThrow()
        })

        test("correct object declaration", () => {
            objectType.build({ num: "number" }, node)
            expect(node.data.children).toBeDefined()
            expect(node.data.children.length).toBe(1)
        })

        test.each([[true], [false]])("add %p required field", (v) => {
            objectType.build({ _required: v, num: "number" }, node)
            expect(node.data.children).toBeDefined()
            expect(node.data.children.length).toBe(1)
            expect(node.data.required).toBe(v)
        })

        test("required not existing", () => {
            objectType.build({ num: "number" }, node)
            expect(node.data.required).toBe(undefined)
        })

        test("multi obj parsing", () => {
            objectType.build({ num: "number", str: "string" }, node)
            expect(node.data.children).toBeDefined()
            expect(node.data.children.length).toBe(2)
        })

        test("wrong type parsing", () => {
            expect(() => objectType.build({ num: "INVALID_TYPE" }, node)).toThrow()
        })

        test("non inline type parsing", () => {
            objectType.build({ num: { _type: "number" } }, node)
            expect(node.data.children).toBeDefined()
            expect(node.data.children.length).toBe(1)
        })

        test("non inline invalid type parsing", () => {
            expect(() => objectType.build({ num: { _type: "INVALID_TYPE" } }, node)).toThrow()
        })
    })

    describe("Value parsing", () => {
        test("parse correct type", () => {
            objectType.build({ num: { _type: "number" } }, node)
            const d = { num: 123 }
            const v = objectType.parseValue(d, node)
            expect(v).not.toBe(d)
            expect(v).toEqual({ num: 123 })
        })

        test("other keys get ignored", () => {
            objectType.build({ num: { _type: "number" } }, node)
            const d = { num: 123, awesome: true }
            const v = objectType.parseValue(d, node)
            expect(v).not.toBe(d)
            expect(v).toEqual({ num: 123 })
        })

        test("key missing", () => {
            objectType.build({ num: { _type: "number" } }, node)
            const d = {}
            const v = objectType.parseValue(d, node)
            expect(v).toEqual({ num: null })
        })

        test("required undefined", () => {
            objectType.build({ _required: true, num: { _type: "number" } }, node)
            expect(() => objectType.parseValue(undefined, node)).toThrow()
        })

        test("required null", () => {
            objectType.build({ _required: true, num: { _type: "number" } }, node)
            expect(() => objectType.parseValue(null, node)).toThrow()
        })

        test("undefined is fine", () => {
            objectType.build({ num: { _type: "number" } }, node)
            const v = objectType.parseValue(undefined, node)
            expect(v).toBeNull()
        })

        test("null is fine", () => {
            objectType.build({ num: { _type: "number" } }, node)
            const v = objectType.parseValue(null, node)
            expect(v).toBeNull()
        })
    })
})