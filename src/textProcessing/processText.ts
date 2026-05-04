import { CommandContext } from "../command/commandContext";
import { TokenizedLine, TokenizedText } from "./tokenizer";
import { TokenizedReader } from "./tokenizedReader";
import { processLine } from "./processLine";
import { convertValue } from "../schema/schemaParser";

export function processText(ctx: CommandContext, text: TokenizedText): string {

    const reader = new TokenizedReader(text)
    const result: string[] = []

    while (reader.hasNext()) {
        reader.consume()
        const r = preProcessLine(ctx, reader, false)
        if (r == null) {
            continue
        }
        result.push(r)
    }

    return result.join("\n")
}

export function preProcessLine(ctx: CommandContext, reader: TokenizedReader<TokenizedLine>, ignore: boolean): string | null {
    const regex = reader.peekCurrent()[0]?.match(/^\s*(#\w+)/)
    if (!regex) {
        return ignore ? null : processLine(ctx, reader.peekCurrent())
    }

    const operation = regex[1]!.toLowerCase()
    switch (operation) {
        case "#if":
            return processCondition(ctx, reader, ignore)
        case "#for":
            return processLoop(ctx, reader, ignore)
        default:
            return processLine(ctx, reader.peekCurrent())
    }
}

export function processCondition(ctx: CommandContext, reader: TokenizedReader<TokenizedLine>, ignore: boolean): string | null {
    const startLn = reader.index;
    const line = ignore ? "#if false" : processLine(ctx, reader.peekCurrent())
    const regex = line.match(/^\s*#if (\w+)/)
    if (!regex) {
        throw new Error(`Line ${reader.index + 1}: Could not resolve result of statement \n - Resolved: ${line}`)
    }

    const operationResult = regex[1]!.trim()
    let truthful = true;
    if (operationResult === "false" ||
        operationResult === "undefined" ||
        operationResult === "null" ||
        operationResult === ""
    ) {
        truthful = false
    }

    const result = []
    let ended = false;

    while (reader.hasNext()) {
        const curr = reader.consume()
        if (/^\s*#endif/.test(curr[0]!)) {
            ended = true;
            break
        }
        const l = preProcessLine(ctx, reader, !truthful || ignore)
        if (l == null) { continue }
        result.push(l)
    }

    if (!ended) {
        throw new Error(`Line ${startLn}: If statement did not close`)
    }

    return (!truthful || ignore) ? null : result.join("\n")
}

export function processLoop(ctx: CommandContext, reader: TokenizedReader<TokenizedLine>, ignore: boolean): string | null {
    const startLn = reader.index;
    const line = ignore ? "#for _ in empty" : processLine(ctx, reader.peekCurrent())
    const regex = line.match(/^\s*#for (\w+) in (.*)/)
    if (!regex) {
        throw new Error(`Line ${reader.index + 1}: Could not resolve result of statement \n - Resolved: ${line}`)
    }

    const variableName = regex[1]!.trim()
    const valueName = regex[2]!.trim()
    const array = ctx.getValue(valueName)

    if (array.length == 0 || valueName == "empty" || valueName == "undefined" || valueName == "null") {
        ignore = true
    }

    let ended = false;

    const startIndex = reader.index;

    while (reader.hasNext()) {
        const curr = reader.consume()
        if (/^\s*#endfor/.test(curr[0]!)) {
            ended = true;
            break
        }

        preProcessLine(ctx, reader, true)
    }

    if (!ended) {
        throw new Error(`Line ${startLn}: If statement did not close`)
    }

    if (ignore) {
        return null
    }

    const endIndex = reader.index;
    const result: any[] = []

    for (let i = 0; i < array.length; i++) {
        const clonedCtx = ctx.copy()
        const arrayValue = array[i];
        reader.index = startIndex;

        convertValue(clonedCtx, variableName, arrayValue)

        while (reader.hasNext()) {
            const curr = reader.consume()
            if (/^\s*#endfor/.test(curr[0]!)) {
                ended = true;
                break
            }

            const line = preProcessLine(clonedCtx, reader, false)
            result.push(line)
        }
    }

    reader.index = endIndex


    return result.join("\n")
}
