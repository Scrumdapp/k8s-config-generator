import {stringType} from "../../../src/schema/schemaTypes/stringType";
import {createRootNode, createSchemaNode, SchemaNode} from "../../../src/schema/schemaNode";

describe("Test the string type", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, stringType, "str")
    })

    describe("Parsing schema data", () => {
        test("Inline declaration", () => {
            stringType.build("string", node)
            expect(node.data.required).toBe(true)
        })

        test("Separate declaration", () => {
            stringType.build({ _type: "string" }, node)
            expect(node.data.required).toBe(undefined)
        })

        test("Inline declaration", () => {
            stringType.build({ _type: "string", required: true }, node)
            expect(node.data.required).toBe(true)
        })

        test("Inline declaration with required set to false", () => {
            stringType.build({ _type: "string", required: false }, node)
            expect(node.data.required).toBe(false)
        })
    })

    describe("Parsing values", () => {
        describe("Simple value tests", () => {
            beforeEach(() => {
                stringType.build("string", node)
            })

            test("correct parsing of number", () => {
                const v = stringType.parseValue(0, node)
                if (typeof v !== "string") {
                    throw new Error("Value did not return a string")
                }
            })

            test("correct parsing of empty string", () => {
                const v = stringType.parseValue("", node)
                if (typeof v !== "string") {
                    throw new Error("Value did not return a number")
                }
            })

            test("correct parsing of string", () => {
                const v = stringType.parseValue("hello", node)
                if (typeof v !== "string") {
                    throw new Error("Value did not return a number")
                }
            })

            test("undefined throw", () => {
                expect(() => stringType.parseValue(undefined, node)).toThrow()
            })

            test("null throw", () => {
                expect(() => stringType.parseValue(null, node)).toThrow()
            })
        })

        test("undefined without required", () => {
            stringType.build({ _type: "string" }, node)
            const v = stringType.parseValue(undefined, node)
            expect(v).toBeUndefined()
        })

        test("null without required", () => {
            stringType.build({ _type: "string" }, node)
            const v = stringType.parseValue(null, node)
            expect(v).toBeUndefined()
        })
    })
})