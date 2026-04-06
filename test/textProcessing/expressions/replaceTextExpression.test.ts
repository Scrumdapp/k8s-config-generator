import {parseExpression} from "../../../src/textProcessing/expression/parseTokenizedExpression";
import {replaceTextExpression} from "../../../src/textProcessing/expression/expressions/replaceTextExpression";
import {CommandContext} from "../../../src/command/commandContext";

describe("Test the replace expression", () => {

    test("Replace keyword returning replace expression", () => {
        const expr = parseExpression('replace "" with "" in ""')
        expect(expr.type).toBe(replaceTextExpression)
    })

    test.each([
        [ '" " -> "-"', 'replace "-" with " " in "Hello-world"', "Hello world" ],
        [ '" " -> ""', 'replace " " with "" in "Hello world"', "Helloworld" ],
        [ '" " -> ""', 'replace "1" with "" in "He1l1l1o1 1w1o1r1ld"', "Hello world" ],
    ])("Expecting the expression %p", (_, expr, expected) => {
        const parsed = parseExpression(expr)
        const result = parsed.type.run(new CommandContext(), parsed)
        expect(result).toBe(expected)
    })
})