import {createTemplate} from "../../src/files/createTemplate";

describe("Test template creation", () => {

    test("create templates", () => {
        const template = createTemplate("test/data/templates/service")
        expect(template.schemaFile).toBeDefined()
        expect(template.getFiles().size).toBe(3)
    })

})