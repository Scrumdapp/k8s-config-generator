import {numberType} from "../../../src/schema/schemaTypes/numberType";
import {createRootNode, createSchemaNode, SchemaNode} from "../../../src/schema/schemaNode";

describe("Test the number type", () => {
    const root = createRootNode()
    let node: SchemaNode

    beforeEach(() => {
        node = createSchemaNode(root, numberType, "num")
    })

    describe("Parsing schema data", () => {

        test("Inline declaration", () => {
            numberType.build("number", node)
            expect(node.data.required).toBe(true)
            expect(node.data.min).toBe(undefined)
            expect(node.data.max).toBe(undefined)
        })

        test("Separate declaration", () => {
            numberType.build({ _type: "number" }, node)
            expect(node.data.required).toBe(undefined)
            expect(node.data.min).toBe(undefined)
            expect(node.data.max).toBe(undefined)
        })

        test("Inline declaration", () => {
            numberType.build({ _type: "number", required: true }, node)
            expect(node.data.required).toBe(true)
        })

        test("Inline declaration with required set to false", () => {
            numberType.build({ _type: "number", required: false }, node)
            expect(node.data.required).toBe(false)
        })

        describe("min and max", () => {
            test("with min value", () => {
                numberType.build({ _type: "number", min: 0 }, node)
                expect(node.data.min).toBe(0)
                expect(node.data.max).toBe(undefined)
            })

            test("with max value", () => {
                numberType.build({ _type: "number", max: 5 }, node)
                expect(node.data.min).toBe(undefined)
                expect(node.data.max).toBe(5)
            })

            test("with min and max", () => {
                numberType.build({ _type: "number", min: 0, max: 5 }, node)
                expect(node.data.min).toBe(0)
                expect(node.data.max).toBe(5)
            })

            test("with min and max failing", () => {
                expect(() => {
                    numberType.build({ _type: "number", min: 5, max: 0 }, node)
                }).toThrow()
            })
        })
    })

    describe("Parsing values", () => {
        describe("Simple value tests", () => {
            beforeEach(() => {
                numberType.build("number", node)
            })

            test("correct parsing", () => {
                const v = numberType.parseValue(0, node)
                if (typeof v !== "number") {
                    throw new Error("Value did not return a number")
                }
            })

            test("required throw", () => {
                expect(() => numberType.parseValue(undefined, node)).toThrow()
            })

            test("string type", () => {
                expect(() => numberType.parseValue("hello", node)).toThrow()
            })

            test("null type", () => {
                expect(() => numberType.parseValue(null, node)).toThrow()
            })
        })

        test("undefined without required", () => {
            numberType.build({ _type: "number" }, node)
            const v = numberType.parseValue(undefined, node)
            expect(v).toBe(null)
        })

        test("null without required", () => {
            numberType.build({ _type: "number" }, node)
            const v = numberType.parseValue(null, node)
            expect(v).toBe(null)
        })

        describe("Min Max tests", () => {
            beforeEach(() => {
                numberType.build({ _type: "number", min: 0, max: 5 }, node)
            })

            test("too low", () => {
                expect(() => numberType.parseValue(-1, node)).toThrow()
            })

            test("too high", () => {
                expect(() => numberType.parseValue(6, node)).toThrow()
            })

            test("correct at min", () => {
                expect(() => numberType.parseValue(0, node)).toThrow()
            })

            test("correct at max", () => {
                expect(() => numberType.parseValue(5, node)).toThrow()
            })
        })
    })
})