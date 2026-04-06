import {createTemplate} from "../../src/files/createTemplate";
import * as FS from "fs";
import {copyCommand} from "../../src/command/commands/copyCommand";

describe("Test template creation", () => {

    test("template life cycle", () => {
        const template = createTemplate("test/data/templates/service")
        expect(template.schemaFile).toBeDefined()
        expect(template.getFiles().size).toBe(3)

        copyCommand.writeFile = jest.fn()

        template.run("data/test-service", {
            name: "test-service",
            namespace: "test",
            image: "scrumdapp/web-client:latest",
            port: 80
        })

        expect(copyCommand.writeFile).toHaveBeenCalled()
    })

})