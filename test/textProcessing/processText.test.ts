import {CommandContext} from "../../src/command/commandContext";
import {tokenize} from "../../src/textProcessing/tokenizer";
import {processText} from "../../src/textProcessing/processText";

const t0 = `
name: checkin-service
image: scrumdapp/web-client:latest
`

const t1 = `
name: {{name}}
image: {{image}}
`

const t2 = `
name: $\{{replace " " with "-" in "{{name}}"}}
image: {{image}}
`

const t3 = `
#if exists name
name: {{name}}
#endif
image: {{image}}
`

const t4 = `
#if exists image
`

describe("Processing of text", () => {

    test("simple multi-line processing test", () => {
        const ctx = new CommandContext()
        const txt = processText(ctx, tokenize(t0))
        expect(txt).toBe(t0)
    })

    test("transform text", () => {
        const ctx = new CommandContext()
        ctx.setValue("name", "web-client")
        ctx.setValue("image", "scrumdapp/web-client:latest")
        const txt = processText(ctx, tokenize(t1))
        expect(txt).toBe(t1.replace("{{name}}", ctx.getValue("name")).replace("{{image}}", ctx.getValue("image")))
    })

    test("expressions text", () => {
        const ctx = new CommandContext()
        ctx.setValue("name", "web client")
        ctx.setValue("image", "scrumdapp/web-client:latest")
        const txt = processText(ctx, tokenize(t2))
        expect(txt).toBe(t1.replace("{{name}}", ctx.getValue("name").replace(" ", "-")).replace("{{image}}", ctx.getValue("image")))
    })

    describe("Texing of statements", () => {

        test("statement test", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "checkin-service")
            ctx.setValue("image", "scrumdapp/web-client:latest")
            const txt = processText(ctx, tokenize(t3))
            expect(txt).toBe(t0)
        })

        test("incomplete statements", () => {
            const ctx = new CommandContext()
            expect(() => processText(ctx, tokenize(t4))).toThrow()
        })

    })

})