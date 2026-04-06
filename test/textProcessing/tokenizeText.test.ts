import {tokenize} from "../../src/textProcessing/tokenizer";

const t0 = `
name: checkin-service
image: scrumdapp/web-client:latest
`

const t1 = `
name: {{name}}
image: {{image}}
`

describe("Test tokenization of texts", () => {

    test("tokenize simple text", () => {
        const tokenized = tokenize(t0)
        expect(tokenized.length).toBe(4)
        expect(tokenized[0]).toEqual([ "" ])
        expect(tokenized[1]).toEqual([ "name: checkin-service" ])
        expect(tokenized[2]).toEqual([ "image: scrumdapp/web-client:latest" ])
        expect(tokenized[3]).toEqual([ "" ])
    })

    test("expressions getting parsed", () => {
        const tokenized = tokenize(t1)
        expect(tokenized.length).toBe(4)
        expect(tokenized[0]).toEqual([ "" ])
        expect(tokenized[1]).toEqual([ "name: ", "{{", "name", "}}" ])
        expect(tokenized[2]).toEqual([ "image: ", "{{", "image", "}}" ])
        expect(tokenized[3]).toEqual([ "" ])
    })

})