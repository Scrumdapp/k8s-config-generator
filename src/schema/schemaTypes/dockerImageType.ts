import {SchemaType, setBooleanFlagIfExists, setStringFlagIfExists} from "../schemaType";
import {assertPresentWithRequired} from "../schemaUtils";

export const dockerImageType: SchemaType = {
    name: "docker_image",
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

        if (!/^(?:(?=[^:\/]{1,253})(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(?:\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*(?::[0-9]{1,5})?\/)?((?![._-])(?:[a-z0-9._-]*)(?<![._-])(?:\/(?![._-])[a-z0-9._-]*(?<![._-]))*)(?::(?![.-])[a-zA-Z0-9_.-]{1,128})?$/.test(obj)) {
            throw new Error(`${node.path}: not a valid docker image tag`)
        }

        return obj;
    }
}