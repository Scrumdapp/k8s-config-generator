import * as FS from "node:fs";
import * as PATH from "node:path";
import {CommandType} from "../commandType";
import {getSchemaValue, getStringValue} from "../commandUtils";
import {processText} from "../../textProcessing/processText";

export const copyCommand: CommandType & { writeFile: (path: string, text: string) => void } = {
    cmd: "copy",
    build: (schema, node) => {
        node.data.copy = getSchemaValue(node, schema, "copy");
        node.data.as = getSchemaValue(node, schema, "as");
    },
    run: (ctx, node) => {
        const copy = getStringValue(ctx, node, "copy")
        const as = getStringValue(ctx, node, "as")

        const source = ctx.getTemplate(copy)
        if (typeof source === "undefined") {
            throw new Error(`${node.command.cmd}: Invalid input file '${copy}'`)
        }

        const txt = processText(ctx, source)
        copyCommand.writeFile(PATH.join(ctx.workDir, as), txt)
    },
    writeFile: (path: string, text: string) => {
        FS.writeFileSync(path, text)
    }
}