import {parseExpression} from "../../../src/textProcessing/expression/parseTokenizedExpression";
import {CommandContext} from "../../../src/command/commandContext";
import {existsExpression} from "../../../src/textProcessing/expression/expressions/existsExpression";
import {processLine} from "../../../src/textProcessing/processLine";
import {tokenizeLine} from "../../../src/textProcessing/tokenizer";

describe("Test the exists expression", () => {

    test("Replace keyword returning replace expression", () => {
        const expr = parseExpression('exists ballr')
        expect(expr.type).toBe(existsExpression)
    })

    test.each([
        [ "exists a", "true" ],
        [ "exists b", "true" ],
        [ "exists c", "true" ],
        [ "exists d", "true" ],
        [ "exists e", "true" ],
        [ "exists f", "false" ],
        [ "exists {{c}}", "true" ],
    ])("Expecting the expression %p to be %p", (expr, expected) => {
        const ctx = new CommandContext()
        ctx.setValue("a", "a")
        ctx.setValue("b", "b")
        ctx.setValue("c", "a")
        ctx.setValue("d", "false")
        ctx.setValue("e", "undefined")
        const parsed = processLine(ctx, tokenizeLine(`$\{{${expr}}}`))
        expect(parsed).toBe(expected)
    })
})