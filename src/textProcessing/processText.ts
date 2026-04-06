import {CommandContext} from "@src/command/commandContext";
import {TokenizedLine, TokenizedText} from "@src/textProcessing/tokenizer";
import {TokenizedReader} from "@src/textProcessing/tokenizedReader";
import {processLine} from "@src/textProcessing/processLine";


export function processText(ctx: CommandContext, text: TokenizedText): string {

    const reader = new TokenizedReader(text)
    const result: string[] = []

    while (reader.hasNext()) {
        reader.consume()
        result.push(preProcessLine(ctx, reader, false))
    }

    return result.join("\n")
}

export function preProcessLine(ctx: CommandContext, reader: TokenizedReader<TokenizedLine>, ignore: boolean): string {
    const regex = reader.peekCurrent()[0].match(/^\s*(#\w+)/)
    if (!regex) {
        return ignore ? "" : processLine(ctx, reader.peekCurrent())
    }

    const operation = regex[0].toLowerCase()
    switch (operation) {
        case "#if":
            return processCondition(ctx, reader, ignore)
        default:
            return processLine(ctx, reader.peekCurrent())
    }
}

export function processCondition(ctx: CommandContext, reader: TokenizedReader<TokenizedLine>, ignore: boolean): string {
    const line = ignore ? "#if false" : processLine(ctx, reader.peekCurrent())
    const regex = line.match(/^\s*#if (\w+)/)
    if (!regex) {
        throw new Error(`Line ${reader.index+1}: Could not resolve result of statement \n - Resolved: ${line}`)
    }

    const operationResult = regex[1].trim()
    let truthful = true;
    if (operationResult === "false" ||
        operationResult === "undefined" ||
        operationResult === "null" ||
        operationResult === ""
    ) {
        truthful = false
    }

    const result = []

    while (reader.hasNext()) {
        const curr = reader.consume()
        if (/^\s*#endif/.test(curr[0])) {
            break
        }
        result.push(preProcessLine(ctx, reader, !truthful || ignore))
    }

    return ignore ? "" : result.join("\n")
}