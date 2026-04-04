import {createCommandContainer} from "../../../src/command/commandNode";
import {commandContainer} from "../../../src/command/commands/commandContainer";
import {CommandContext} from "../../../src/command/commandContext";

describe("Testing of command container", () => {

    describe("Parsing test", () => {
        test("test single cmd parsing", () => {
            const cmd = createCommandContainer([
                { set: "123", to: "epic" }
            ])
            expect(cmd.command).toBe(commandContainer)
            expect(cmd.data.children.length).toBe(1)
        })

        test("test multi cmd parsing", () => {
            const cmd = createCommandContainer([
                { set: "123", to: "a" },
                { set: "456", to: "b" },
                { set: "789", to: "c" },
            ])

            expect(cmd.command).toBe(commandContainer)
            expect(cmd.data.children.length).toBe(3)
        })

        test("no command in container", () => {
            const cmd = createCommandContainer([])

            expect(cmd.command).toBe(commandContainer)
            expect(cmd.data.children.length).toBe(0)
        })

        test("command type in command to throw", () => {
            expect(() => createCommandContainer([
                { container: "WHA" }
            ])).toThrow()
        })

        test("invalid argument to throw", () => {
            expect(() => createCommandContainer({})).toThrow()
        })
    })

    describe("Container running", () => {
        test("running with no commands to be fine", () => {
            const cmd = createCommandContainer([])
            const ctx = new CommandContext()
            expect(() => cmd.command.run(ctx, cmd)).not.toThrow()
        })

        test("running with single command to be fine", () => {
            const cmd = createCommandContainer([
                { set: "a", to: "b" }
            ])
            const ctx = new CommandContext()
            expect(() => cmd.command.run(ctx, cmd)).not.toThrow()
        })

        test("running with many commands to be fine", () => {
            const cmd = createCommandContainer([
                { set: "a", to: "e" },
                { set: "b", to: "f" },
                { set: "c", to: "g" },
                { set: "d", to: "h" }
            ])
            const ctx = new CommandContext()
            expect(() => cmd.command.run(ctx, cmd)).not.toThrow()
        })
    })

})