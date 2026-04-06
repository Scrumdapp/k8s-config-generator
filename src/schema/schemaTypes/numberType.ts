import {SchemaType, setBooleanFlagIfExists, setNumberFlagIfExists} from "../schemaType";
import {assert, assertPresentWithRequired, withValueOrSkip} from "../schemaUtils";

export const numberType: SchemaType = {
    name: "number",
    build: (schema, node) => {
        if (typeof schema === "string") {
            node.data.required = true;
            return;
        }

        setBooleanFlagIfExists(schema, "required", node)
        const minExists = setNumberFlagIfExists(schema, "min", node)
        const maxExists = setNumberFlagIfExists(schema, "max", node)

        if (minExists && maxExists) {
            if (node.data.min > node.data.max) {
                throw new Error(`The min is bigger than the max on '${node.path}'`)
            }
        }
    },
    parseValue: (obj, node) => {
        if (!assertPresentWithRequired(obj, node)) {
            return undefined
        }

        if (typeof obj !== "number") {
            throw new Error(`Field '${node.path}' cannot be parsed as a number`)
        }

        withValueOrSkip<number>(node, "min", (min) =>
            assert(node, "value must be higher than min", () => obj >= min)
        )

        withValueOrSkip<number>(node, "max", (max) =>
            assert(node, "value must be lower than max", () => obj <= max)
        )

        return obj;
    }
}