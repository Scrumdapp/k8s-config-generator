import {CommandType} from "../commandType";
import {parseCommand} from "../commandParser";
import {CommandNode} from "../commandNode";
import {getSchemaValue, getStringValue} from "../commandUtils";

export const ifCommand: CommandType = {
    cmd: "if",
    build: (schema, node) => {
        node.data.if = getSchemaValue(node, schema, "if");
        node.data.if = `\${{${node.data.if}}}`

        if (!schema.hasOwnProperty("do")) {
            throw new Error(`Cmd ${node.command.cmd} is missing property 'do'`)
        }

        if (typeof schema["do"] !== "object" || !(schema["do"] instanceof Array)) {
            throw new Error(`Cmd ${node.command.cmd}: Property 'do' is not an list`)
        }

        const children = [];
        for (let schemaElement of schema["do"]) {
            children.push(parseCommand(schemaElement))
        }

        node.data.children = children
    },

    run: (ctx, node) => {
        const operationResult = getStringValue(ctx, node, "if")
        let truthful = true;
        if (operationResult === "false" ||
            operationResult === "undefined" ||
            operationResult === "null" ||
            operationResult === ""
        ) {
            truthful = false
        }

        if (truthful) {
            for (let child of node.data.children as CommandNode[]) {
                child.command.run(ctx, child)
            }
        }
    }
}