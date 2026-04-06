import {CommandType} from "../commandType";
import {parseCommand} from "../commandParser";
import {CommandNode} from "../commandNode";

export const commandContainer: CommandType = {
    cmd: "container",
    build: (schema, node) => {
        const children = [];
        if (!(schema instanceof Array)) {
            throw new Error(`${node.command.cmd}: Invalid schema type`)
        }

        for (let schemaElement of schema) {
            children.push(parseCommand(schemaElement))
        }

        node.data.children = children
    },

    run: (ctx, node) => {
        for (let child of node.data.children as CommandNode[]) {
            child.command.run(ctx, child)
        }
    }
}