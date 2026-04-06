import {readSchemaFile} from "../../src/files/parse-yaml";


describe("Reading schema file", () => {

    test("no keys", () => {
        expect(() => readSchemaFile({})).toThrow()
    })

    test("no do key", () => {
        expect(() => readSchemaFile({ schema: { name: "string" } })).toThrow()
    })

    test("no schema key", () => {
        expect(() => readSchemaFile({ do: [ {
            echo: "Creating file {{name}}-deployment.yaml"
        } ] })).toThrow()
    })

    test("too many keys", () => {
        expect(() => readSchemaFile({
            schema: {
                name: "string"
            },
            image: "string",
            do: [
                { echo: "Creating file {{name}}-deployment.yaml" }
            ],
        })).toThrow()
    })

    test("all keys present", () => {
        expect(() => readSchemaFile({
            schema: {
                name: "string"
            },
            do: [
                { echo: "Creating file {{name}}-deployment.yaml" }
            ]
        })).not.toThrow()
    })

})
