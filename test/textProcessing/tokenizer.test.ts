import {tokenizeLine} from "../../src/textProcessing/tokenizer";


describe("Test text tokenization", () => {

    describe("Single line tokenization", () => {
        test("parse without tokens", () => {
            const line = tokenizeLine("No expressions! No fear!")
            expect(line.length).toBe(1)
            expect(line[0]).toBe("No expressions! No fear!")
        })

        test.each([
            ["begin", [ "{{", "people", "}}", " how are you all doing" ]],
            ["middle", [ "Hello! ", "{{", "name", "}}", " What's up?" ]],
            ["end", [ "Hello! ", "{{", "name", "}}" ]]
        ] as [string, string[]][])("parse with single token at %p", (_, expected) => {
            const txt = expected.join("")
            const tokenized = tokenizeLine(txt)
            expect(tokenized.length).toBe(expected.length)
            for (let i in expected) {
                expect(expected[i]).toBe(tokenized[i])
            }
        })

        test.each([
            [[ "{how are you doing}" ]],
            [[ "{how are you ", "{{", "doing", "}}" ]],
            [[ "{how are you ", "{{", "doing", "}}", "}" ]],
            [[ "how are {you} ", "{{", "doing", "}}", "}" ]],
        ])("parse with not capturing: %p", (expected) => {
            const txt = expected.join("")
            const tokenized = tokenizeLine(txt)
            expect(tokenized.length).toBe(expected.length)
            for (let i in expected) {
                expect(expected[i]).toBe(tokenized[i])
            }
        })

        test.each([
            [[ "{how are you doing}" ]],
            [[ "{how are you ", "${{", "doing", "}}" ]],
            [[ "{how are you ", "${{", "doing", "}}", "}" ]],
            [[ "how are {you} ", "${{", "doing", "}}", "}" ]],
        ])("match for expression: %p", (expected) => {
            const txt = expected.join("")
            const tokenized = tokenizeLine(txt)
            expect(tokenized.length).toBe(expected.length)
            for (let i in expected) {
                expect(expected[i]).toBe(tokenized[i])
            }
        })

        test("match for nested expressions", () => {
            const expected = [ "${{", "replace \"", "{{", "char", "}}", "\" to \"/\" in test", "}}" ]
            const txt = expected.join("")
            const tokenized = tokenizeLine(txt)
            expect(tokenized.length).toBe(expected.length)
            for (let i in expected) {
                expect(expected[i]).toBe(tokenized[i])
            }
        })

        test("match for multiple expressions", () => {
            const expected = [ "expr 1: ", "{{", "char", "}}", "expr 2: ", "{{", "name", "}}" ]
            const txt = expected.join("")
            const tokenized = tokenizeLine(txt)
            expect(tokenized.length).toBe(expected.length)
            for (let i in expected) {
                expect(expected[i]).toBe(tokenized[i])
            }
        })
    })

})