import {createRootNode, createSchemaNode, SchemaNode} from "../../../src/schema/schemaNode";
import {nameType} from "../../../src/schema/schemaTypes/nameType";
import {schemaTypes} from "../../../src/schema/schemaTypes";

describe("Test the name type", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, nameType, "name_string")
    })

    test("check if name responds to nameType", () => {
        expect(schemaTypes.get("name_string")).toBe(nameType)
    })

    describe("Parsing schema data", () => {

        test("inline declaration", () => {
            nameType.build("name_string", node)
            expect(node.data.required).toBe(true)
        })

        test("separate declaration", () => {
            nameType.build({ _type: "name_string" }, node)
            expect(node.data.required).toBe(undefined)
        })

        test("inline declaration", () => {
            nameType.build({ _type: "name_string", required: true }, node)
            expect(node.data.required).toBe(true)
        })

        test("inline declaration with required set to false", () => {
            nameType.build({ _type: "name_string", required: false }, node)
            expect(node.data.required).toBe(false)
        })
    })

    describe("Parsing values", () => {
        describe("Simple value tests", () => {
            beforeEach(() => {
                nameType.build("name_string", node)
            })

            test("correct parsing", () => {
                const v = nameType.parseValue("web-client", node)
                if (typeof v !== "string") {
                    throw new Error("Value did not return a string")
                }
            })

            test.each([
                [ "web-client" ],
                [ "csv-client" ],
                [ "test-01" ],
                [ "gaming" ]
            ])("value %p", (v) => {
                const r = nameType.parseValue(v, node)
                expect(r).toBe(v)
            })

            test.each([
                [ "test-" ],
                [ "0123" ],
                [ "-test" ],
                [ "test_client" ]
            ])("value %p to throw", (v) => {
                expect(() => nameType.parseValue(v, node)).toThrow()
            })

            test("required throw", () => {
                expect(() => nameType.parseValue(undefined, node)).toThrow()
            })

            test("number type", () => {
                expect(() => nameType.parseValue(0, node)).toThrow()
            })

            test("null type", () => {
                expect(() => nameType.parseValue(null, node)).toThrow()
            })
        })

        test("undefined without required", () => {
            nameType.build({ _type: "name_string" }, node)
            const v = nameType.parseValue(undefined, node)
            expect(v).toBe(undefined)
        })

        test("null without required", () => {
            nameType.build({ _type: "name_string" }, node)
            const v = nameType.parseValue(null, node)
            expect(v).toBe(undefined)
        })
    })
})