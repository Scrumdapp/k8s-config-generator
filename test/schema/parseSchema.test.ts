import {parseSchema} from "../../src/schema/schemaParser";

describe("Parse scheme", () => {
    test("parse correctly", () => {
        const schema = parseSchema({
            num: { _type: "number", min: 5 },
            bob: "string"
        })

        expect(schema.name).toBe("_schema")
        expect(schema.data.children).toBeDefined()
    })

    test("parse correctly nested", () => {
        const schema = parseSchema({
            object: { num: "number" },
        })

        expect(schema.data.children).toBeDefined()
        expect(schema.data.children[0].data.children).toBeDefined()
    })


    test("empty schema error", () => {
        expect(() => parseSchema({})).toThrow()
    })

    test("undefined error", () => {
        expect(() => parseSchema(undefined)).toThrow()
    })

    test("null error", () => {
        expect(() => parseSchema(null)).toThrow()
    })

    test("number error", () => {
        expect(() => parseSchema(0)).toThrow()
    })

    test("string error", () => {
        expect(() => parseSchema("hello")).toThrow()
    })

    test("path test", () => {
        const schema = parseSchema({
            some: { nested: { value: "number" } },
        })
        expect(schema.data.children[0].path).toBe("some")
        expect(schema.data.children[0].data.children[0].path).toBe("some.nested")
        expect(schema.data.children[0].data.children[0].data.children[0].path).toBe("some.nested.value")
    })
})