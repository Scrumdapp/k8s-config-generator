import {SchemaType, setBooleanFlagIfExists, setStringFlagIfExists} from "../schemaType";
import {assertPresentWithRequired} from "../schemaUtils";

export const nameType: SchemaType = {
    name: "name_string",
    build: (schema, node) => {
        if (typeof schema === "string") {
            node.data.required = true;
            return;
        }

        setBooleanFlagIfExists(schema, "required", node)
        setStringFlagIfExists(schema, "default", node)
    },
    parseValue: (obj, node) => {
        if (!assertPresentWithRequired(obj, node, it => obj = it)) {
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