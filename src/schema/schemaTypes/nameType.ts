import {SchemaType, setBooleanFlagIfExists} from "@src/schema/schemaType";
import {assertPresentWithRequired} from "@src/schema/schemaUtils";

export const nameType: SchemaType = {
    name: "name_string",
    build: (schema, node) => {
        if (typeof schema === "string") {
            node.data.required = true;
            return;
        }

        setBooleanFlagIfExists(schema, "required", node)
    },
    parseValue: (obj, node) => {
        if (!assertPresentWithRequired(obj, node)) {
            return undefined
        }

        if (typeof obj !== "string") {
            throw new Error(`${node.path}: must be a string`)
        }

        if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(obj)) {
            throw new Error(`${node.path}: value did not match '/^[a-z][a-z0-9-]*[a-z0-9]$/'`)
        }

        return obj;
    }
}