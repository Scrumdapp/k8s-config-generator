import {parseSchema, readSchemaValues} from "../../src/schema/schemaParser";

const schema = {
    name: "string",
    port: {
        _type: "number",
        required: true,
        min: 0,
        max: 65535
    },
    traefik: {
        match: "string",
        middleware: {
            _type: "string"
        }
    }
}


describe("Read a schema and converting its values", () => {

    const parsedSchema = parseSchema(schema)

    test("required values parsing", () => {
        const ctx = readSchemaValues({
            name: "web-client",
            port: 80
        }, parsedSchema)

        expect(ctx.getValue("name")).toBe("web-client")
        expect(ctx.getValue("port")).toBe(80)
        expect(ctx.containsValue("traefik")).toBe(false)
    })

    test("read nested object", () => {
        const ctx = readSchemaValues({
            name: "web-client",
            port: 80,
            traefik: {
                match: "Host(`scrumdapp.com`)"
            }
        }, parsedSchema)

        expect(ctx.containsValue("traefik")).toBe(true)
        expect(ctx.getValue("traefik")).toEqual({ match: "Host(`scrumdapp.com`)" })
        expect(ctx.getValue("traefik.match")).toBe("Host(`scrumdapp.com`)")
    })

})