import {CommandType} from "../commandType";
import {getSchemaValue, getStringValue} from "../commandUtils";

export const setCommand: CommandType = {
    cmd: "set",
    build: (schema, node) => {
        node.data.set = getSchemaValue(node, schema, "set");
        node.data.to = getSchemaValue(node, schema, "to");
    },
    run: (ctx, node) => {
        const setValue = getStringValue(ctx, node, "set")
        const toValue = getStringValue(ctx, node, "to")

        ctx.setValue(setValue, toValue)
    }
}