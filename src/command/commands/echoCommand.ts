import {CommandType} from "@src/command/commandType";
import {getSchemaValue, getStringValue} from "@src/command/commandUtils";

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