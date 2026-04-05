import {parseTokenizedExpression} from "../../src/textProcessing/expression/parseTokenizedExpression";

describe("Test expression parsing", () => {

    test("Simple parsing test", () => {
        const expr = parseTokenizedExpression([ "replace", '"', " ", '"', "with", '"', "_", '"', "in", '"', "some text", '"' ])
        expect(expr.values.size).toBe(3)
        expect(expr.getString("from")).toBe(" ")
        expect(expr.getString("to")).toBe("_")
        expect(expr.getString("text")).toBe("some text")
    })

    test("Incorrect expression", () => {
        expect(() => parseTokenizedExpression([ "replace", '"', " ", '"', "with", '"', "_", '"', "in", '"', "some text" ])).toThrow()
    })

})