import {getTemplateFiles, getTemplates, schema_file_name} from "../../src/files/folderReader"

describe("Read the files in a dir", () => {
    test("Get all templates in directory", () => {
        const templates = getTemplates("test/data/templates")
        expect(templates).toContain("service")
        expect(templates).not.toContain("invalid_service")
        expect(templates.length).toBe(1)
    })

    test("Get all templates in invalid directory", () => {
        expect(() => getTemplates("test/data/some_invalid_folder")).toThrow()
    })

    test("Read files from template", () => {
        const files = getTemplateFiles("test/data/templates/service")
        expect(files.length).not.toBe(0)
        expect(files).not.toContain(schema_file_name)
    })

    test("Fail reading template without schema", () => {
        expect(() => getTemplateFiles("test/data/templates/invalid_service")).toThrow()
    })

    test("Fail reading template with no folder", () => {
        expect(() => getTemplateFiles("test/data/templates/this_folder_does_not_exist")).toThrow()
    })
})
