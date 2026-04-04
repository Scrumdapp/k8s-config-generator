import {CommandType} from "@src/command/commandType";
import {getSchemaValue, getStringValue} from "@src/command/commandUtils";

export const setCommand: CommandType = {
    cmd: "set",
    build: (schema, node) => {
        node.data.set = getSchemaValue(node, schema, "set");
        node.data.to = getSchemaValue(node, schema, "to");
    },
    run: (ctx, node) => {
        const setValue = getStringValue(node, "set")
        const toValue = getStringValue(node, "to")

        ctx.setValue(setValue, toValue)
    }
}