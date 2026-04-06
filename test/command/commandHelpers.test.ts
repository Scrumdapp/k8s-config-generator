import {CommandNode, createCommandNode} from "../../src/command/commandNode";
import {getNumberValue, getSchemaValue, getStringValue} from "../../src/command/commandUtils";
import {CommandContext} from "../../src/command/commandContext";

describe("Test command helpers", () => {
    let node: CommandNode

    beforeEach(() => {
        // Its fine don't need command type
        node = createCommandNode(null)
    })

    describe("Get schema value", () => {
        test("set of cmd data", () => {
            const unparsedNode = {
                abc: "123"
            }
            const v = getSchemaValue(node, unparsedNode, "abc")
            expect(v).toEqual("123")
        })

        test("error when property missing", () => {
            const unparsedNode = { }
            expect(() => getSchemaValue(node, unparsedNode, "abc")).toThrow()
        })
    })

    describe("Get string value", () => {
        let ctx: CommandContext
        beforeEach(() => {
            const unparsedNode = {
                simple: "123",
                complex: "{{service}}-deployment.yaml",
                invalid: "{{service-deployment.yaml",
                number: 123,
                no: null
            }

            for (let unparsedNodeKey in unparsedNode) {
                node.data[unparsedNodeKey] = getSchemaValue(node, unparsedNode, unparsedNodeKey)
            }

            ctx = new CommandContext()
            ctx.setValue("service", "web-client")
        })

        test("simple string parsing", () => {
            const v = getStringValue(ctx, node, "simple");
            expect(v).toBe("123")
        })

        test("number parsing", () => {
            const v = getStringValue(ctx, node, "number");
            expect(v).toBe("123")
        })

        test("expression parsing", () => {
            const v = getStringValue(ctx, node, "complex");
            expect(v).toBe("web-client-deployment.yaml")
        })

        test("null parsing", () => {
            const v = getStringValue(ctx, node, "no");
            expect(v).toBe("null")
        })
    })

    describe("number parsing", () => {
        let ctx: CommandContext
        beforeEach(() => {
            const unparsedNode = {
                strNum: "69420",
                strNumNeg: "-69420",
                number: 123,
                complex: "{{number}}456",
                complexInv: "{{service}}-deployment.yaml",
                no: null
            }

            for (let unparsedNodeKey in unparsedNode) {
                node.data[unparsedNodeKey] = getSchemaValue(node, unparsedNode, unparsedNodeKey)
            }

            ctx = new CommandContext()
            ctx.setValue("service", "web-client")
            ctx.setValue("number", "123")
        })

        test("simple string parsing", () => {
            const v = getNumberValue(ctx, node, "strNum");
            expect(v).toBe(69420)
        })

        test("simple negative string parsing", () => {
            const v = getNumberValue(ctx, node, "strNumNeg");
            expect(v).toBe(-69420)
        })

        test("invalid expr parsing", () => {
            expect(() => getNumberValue(ctx, node, "complexInv")).toThrow()
        })

        test("expression parsing", () => {
            const v = getNumberValue(ctx, node, "complex");
            expect(v).toBe(123456)
        })

        test("null parsing", () => {
            expect(() => getNumberValue(ctx, node, "no")).toThrow()
        })
    })

})