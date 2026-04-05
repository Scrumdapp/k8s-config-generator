import {CommandContext} from "@src/command/commandContext";
import {TokenizedLine, TokenizedText} from "@src/textProcessing/tokenizer";
import {TokenizedLineReader} from "@src/textProcessing/tokenizedLineReader";
import {parseExpression} from "@src/textProcessing/expression/parseTokenizedExpression";

export function processText(ctx: CommandContext, text: TokenizedText): string {

}

export function processLine(ctx: CommandContext, line: TokenizedLine): string {
    const reader = new TokenizedLineReader(line);
    let result = ""

    while (reader.hasNext()) {
        const text = processToken(ctx, reader)
        result += text
    }
}

function processToken(ctx: CommandContext, reader: TokenizedLineReader): string {
    switch (reader.peekCurrent()) {
        case "${{":
            return processVariable(ctx, reader)
        case "{{":
            reader.consume()
            break
        default:
            return reader.peekCurrent()
    }
}

function processVariable(ctx: CommandContext, reader: TokenizedLineReader): string {
    let result = ""
    while (reader.consume() != "}}") {
        result += processToken(ctx, reader)
    }
    return ctx.getValue(result)
}

function processExpression(ctx: CommandContext, reader: TokenizedLineReader): string {
    let result = ""
    while (reader.consume() != "}}") {
        result += processToken(ctx, reader)
    }

    const expr = parseExpression(result)
    return expr.type.run(expr)
}