import {CommandContext} from "../../src/command/commandContext";
import {processLine} from "../../src/textProcessing/processText";
import {tokenizeLine} from "../../src/textProcessing/tokenizer";

describe("Processing of text", () => {

    describe("Variables", () => {
        test("No processor test", () => {
            const ctx = new CommandContext()
            const result = processLine(ctx, tokenizeLine("Hello World!"))
            expect(result).toBe("Hello World!")
        })

        test("Single variable testing", () => {
            const ctx = new CommandContext()
            ctx.setValue("value", "Bob")

            const result = processLine(ctx, tokenizeLine("Hello {{value}}"))
            expect(result).toBe("Hello Bob")
        })

        test("Multi variable test", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "Bob")
            ctx.setValue("age", 16)

            const result = processLine(ctx, tokenizeLine("{{name}} is {{age}} years old"))
            expect(result).toBe("Bob is 16 years old")
        })

        test.each([
            ["bob"],
            ["richard"]
        ])("Nested variables test - %p", (name) => {
            const ctx = new CommandContext()
            ctx.setValue("name", name)
            ctx.setValue("age-bob", 16)
            ctx.setValue("age-richard", 69)

            const result = processLine(ctx, tokenizeLine("{{name}} is {{age-{{name}}}} years old"))
            expect(result).toBe(`${name} is ${ctx.getValue(`age-${name}`)} years old`)
        })
    })

    describe("Expressions parsing", () => {
        test("Simple expression parsing", () => {
            const ctx = new CommandContext()
            const result = processLine(ctx, tokenizeLine('Hello ${{replace "_" with " " in "bob_ross"}}'))
            expect(result).toBe("Hello bob ross")
        })

        test("Test expression with variables", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "bob_ross")

            const result = processLine(ctx, tokenizeLine('Hello ${{replace "_" with " " in "{{name}}"}}'))
            expect(result).toBe("Hello bob ross")
        })

        test("Test nested expression with variables", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "M1a11g11n1u11s1_1C1a111r1l1s1o11n1")

            const result = processLine(ctx, tokenizeLine('Hello ${{replace "_" with " " in "${{replace "1" with "" in "{{name}}"}}"}}'))
            expect(result).toBe("Hello Magnus Carlson")
        })
    })

})