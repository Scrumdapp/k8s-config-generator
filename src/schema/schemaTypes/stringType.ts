import {SchemaType, setBooleanFlagIfExists} from "../schemaType";
import {assertPresentWithRequired} from "../schemaUtils";

export const stringType: SchemaType = {
    name: "string",
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

        let v: string = ""
        switch (typeof obj) {
            case "number":
                v = obj.toString()
                break
            case "string":
                v = obj as string
                break
            default:
                throw new Error(`Field '${node.path}' cannot be parsed as a number`)
        }

        return v;
    }
}