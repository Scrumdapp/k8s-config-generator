import {CommandContext} from "../../src/command/commandContext";
import {tokenizeFile} from "../../src/textProcessing/tokenizer";
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

const t5 = `
_template: service
#if exists name
name: {{name}}
#if exists image
image: {{image}}
#endif
port: 3000
#endif
`

const t5r1 = `
_template: service
name: checkin-service
image: scrumdapp/web-client:latest
port: 3000
`

const t5r2 = `
_template: service
name: checkin-service
port: 3000
`

const t5r3 = `
_template: service
`

describe("Processing of text", () => {

    test("simple multi-line processing test", () => {
        const ctx = new CommandContext()
        const txt = processText(ctx, tokenizeFile(t0))
        expect(txt).toBe(t0)
    })

    test("transform text", () => {
        const ctx = new CommandContext()
        ctx.setValue("name", "web-client")
        ctx.setValue("image", "scrumdapp/web-client:latest")
        const txt = processText(ctx, tokenizeFile(t1))
        expect(txt).toBe(t1.replace("{{name}}", ctx.getValue("name")).replace("{{image}}", ctx.getValue("image")))
    })

    test("expressions text", () => {
        const ctx = new CommandContext()
        ctx.setValue("name", "web client")
        ctx.setValue("image", "scrumdapp/web-client:latest")
        const txt = processText(ctx, tokenizeFile(t2))
        expect(txt).toBe(t1.replace("{{name}}", ctx.getValue("name").replace(" ", "-")).replace("{{image}}", ctx.getValue("image")))
    })

    describe("Texing of statements", () => {

        test("statement test", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "checkin-service")
            ctx.setValue("image", "scrumdapp/web-client:latest")
            const txt = processText(ctx, tokenizeFile(t3))
            expect(txt).toBe(t0)
        })

        test("nested statements both true", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "checkin-service")
            ctx.setValue("image", "scrumdapp/web-client:latest")
            const txt = processText(ctx, tokenizeFile(t5))
            expect(txt).toBe(t5r1)
        })

        test("nested statements parent true", () => {
            const ctx = new CommandContext()
            ctx.setValue("name", "checkin-service")
            const txt = processText(ctx, tokenizeFile(t5))
            expect(txt.trim()).toBe(t5r2.trim())
        })

        test("nested statements child true", () => {
            const ctx = new CommandContext()
            ctx.setValue("image", "scrumdapp/web-client:latest")
            const txt = processText(ctx, tokenizeFile(t5))
            expect(txt.trim()).toBe(t5r3.trim())
        })

        test("incomplete statements", () => {
            const ctx = new CommandContext()
            expect(() => processText(ctx, tokenizeFile(t4))).toThrow()
        })

    })

})