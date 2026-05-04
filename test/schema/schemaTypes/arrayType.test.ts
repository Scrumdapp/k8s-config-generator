import { createRootNode, createSchemaNode, SchemaNode } from "../../../src/schema/schemaNode";
import { arrayType } from "../../../src/schema/schemaTypes/arrayType";
import { schemaTypes } from "../../../src/schema/schemaTypes";
import { nameType } from "../../../src/schema/schemaTypes/nameType";
import { objectType } from "../../../src/schema/schemaTypes/objectType";

describe("Test the array type", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, arrayType, "array")
    })

    test("check if name responds to arrayType", () => {
        expect(schemaTypes.get("array")).toBe(arrayType)
    })

    describe("Parsing schema data", () => {

        test("inline declaration should throw", () => {
            expect(() => arrayType.build("array", node)).toThrow()
        })

        test("separate declaration without item throw", () => {
            expect(() => arrayType.build({ _type: "array" }, node)).toThrow()
        })

        test("separate declaration with item is fine", () => {
            arrayType.build({
                _type: "array",
                item: "name_string"
            }, node)

            expect(node.type).toBe(arrayType)
        })

        test("child gets build properly inline", () => {
            arrayType.build({
                _type: "array",
                item: "name_string"
            }, node)

            expect(node.data.itemNode).toBeDefined()
            expect(node.data.itemNode.type).toBe(nameType)
        })

        test("required to be undefined when not declared", () => {
            arrayType.build({
                _type: "array",
                item: "name_string"
            }, node)

            expect(node.data.required).toBe(undefined)
        })

        test("required to be false when declared", () => {
            arrayType.build({
                _type: "array",
                required: false,
                item: "name_string"
            }, node)

            expect(node.data.required).toBe(false)
        })

        test("required to be true when declared", () => {
            arrayType.build({
                _type: "array",
                required: true,
                item: "name_string"
            }, node)

            expect(node.data.required).toBe(true)
        })

        test("test normal decleration for item", () => {
            arrayType.build({
                _type: "array",
                required: true,
                item: "name_string"
            }, node)

            expect(node.data.itemNode.type).toBe(nameType)
        })


        test("object parsing type", () => {
            arrayType.build({
                _type: "array",
                required: true,
                item: {
                    name: "name_string"
                }
            }, node)

            expect(node.data.itemNode.type).toBe(objectType)
        })
    })

    describe("Parsing values", () => {
        describe("Simple value tests", () => {
            beforeEach(() => {
                arrayType.build({
                    _type: "array",
                    item: "name_string"
                }, node)
            })

            test("correct parsing - single item", () => {
                const v = arrayType.parseValue([
                    "web-client"
                ], node)

                expect(v).toBeInstanceOf(Array)
                expect(v.length).toBe(1)
                expect(v[0]).toBe("web-client")
            })

            test("correct parsing - multiple items", () => {
                const v = arrayType.parseValue([
                    "web-client",
                    "gateway",
                    "traefik"
                ], node)

                expect(v).toBeInstanceOf(Array)
                expect(v.length).toBe(3)
                expect(v[0]).toBe("web-client")
                expect(v[1]).toBe("gateway")
                expect(v[2]).toBe("traefik")
            })

            test.each([
                ["test-"],
                ["0123"],
                ["-test"],
                ["test_client"]
            ])("value %p to throw", (v) => {
                expect(() => arrayType.parseValue([v], node)).toThrow()
            })

            test("required be fine", () => {
                const v = arrayType.parseValue(undefined, node)
                expect(v).toBe(undefined)
            })

            test("number type throw", () => {
                expect(() => arrayType.parseValue(0, node)).toThrow()
            })

            test("string type throw", () => {
                expect(() => arrayType.parseValue("hello", node)).toThrow()
            })

            test("empty array", () => {
                const v = arrayType.parseValue([], node)
                expect(v).toBeInstanceOf(Array)
                expect(v.length).toBe(0)
            })
        })

        test("undefined without required", () => {
            arrayType.build({ _type: "array", item: "docker_image" }, node)
            const v = arrayType.parseValue(undefined, node)
            expect(v).toBe(undefined)
        })

        test("null without required", () => {
            arrayType.build({ _type: "array", item: "number" }, node)
            const v = arrayType.parseValue(null, node)
            expect(v).toBe(undefined)
        })

        test("object type", () => {
            arrayType.build({
                _type: "array",
                required: true,
                item: {
                    name: "name_string"
                }
            }, node)

            const v = arrayType.parseValue([{ name: "web-client" }], node)
            expect(v.length).toBe(1)
            expect(typeof v[0]).toBe("object")
            expect(v[0].name).toBe("web-client")
        })

    })
})
