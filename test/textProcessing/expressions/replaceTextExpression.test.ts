import {parseExpression} from "../../../src/textProcessing/expression/parseTokenizedExpression";
import {replaceTextExpression} from "../../../src/textProcessing/expression/expressions/replaceTextExpression";

describe("Test the replace expression", () => {

    test("Replace keyword returning replace expression", () => {
        const expr = parseExpression('replace "" to "" in ""')
        expect(expr.type).toBe(replaceTextExpression)
    })

    test.each([
        [ '" " -> "-"', 'replace "-" to " " in "Hello-world"', "Hello world" ],
        [ '" " -> ""', 'replace " " to "" in "Hello world"', "Helloworld" ]
    ])("Expecting the expression %p", (_, expr, expected) => {
        const parsed = parseExpression(expr)
        const result = parsed.type.run(parsed)
        expect(result).toBe(expected)
    })
})