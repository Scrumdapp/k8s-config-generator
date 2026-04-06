import {CommandType} from "../commandType";
import {getSchemaValue, getStringValue} from "../commandUtils";

export const echoCommand: CommandType = {
    cmd: "echo",
    build: (schema, node) => {
        node.data.echo = getSchemaValue(node, schema, "echo");
    },
    run: (ctx, node) => {
        const message = getStringValue(ctx, node, "echo")
        console.log(`echo: ${message}`)
    }
}