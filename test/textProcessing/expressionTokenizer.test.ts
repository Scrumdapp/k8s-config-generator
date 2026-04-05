import {tokenizeExpression} from "../../src/textProcessing/tokenizeExpression";


describe("Test expression tokenization", () => {
    test.each([
        [ 'echo "Hello World"', [ "echo", '"', "Hello World", '"' ]],
        [ 'replace "Hello" to "abc awesome" in hello', [ "replace", '"', "Hello", '"', "to", '"', "abc awesome", '"', "in", "hello" ]],
        [ 'replace " " to " - " in hello', [ "replace", '"', " ", '"', "to", '"', " - ", '"', "in", "hello" ]],
    ] as [string, string[]][])("match for expression: %p", (input, expected) => {
        const tokenized = tokenizeExpression(input)
        expect(tokenized.length).toBe(expected.length)
        for (let i in expected) {
            expect(expected[i]).toBe(tokenized[i])
        }
    })

    test("throw when string is not closed", () => {
        const string = 'replace "Hello to "abc awesome" in hello'
        expect(() => tokenizeExpression(string)).toThrow()
    })
})