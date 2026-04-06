import {CommandContext} from "@src/command/commandContext";
import {TokenizedKey, TokenizedLine} from "@src/textProcessing/tokenizer";
import {TokenizedReader} from "@src/textProcessing/tokenizedReader";
import {parseExpression} from "@src/textProcessing/expression/parseTokenizedExpression";


export function processLine(ctx: CommandContext, line: TokenizedLine): string {
    const reader = new TokenizedReader(line);
    let result = ""

    while (reader.hasNext()) {
        reader.consume()
        const text = processToken(ctx, reader)
        result += text
    }

    return result
}

function processToken(ctx: CommandContext, reader: TokenizedReader<TokenizedKey>): string {
    switch (reader.peekCurrent()) {
        case "{{":
            return processVariable(ctx, reader)
        case "${{":
            return processExpression(ctx, reader)
        default:
            return reader.peekCurrent()
    }
}

function processVariable(ctx: CommandContext, reader: TokenizedReader<TokenizedKey>): string {
    let result = ""
    reader.consume()
    while (reader.peekCurrent() != "}}") {
        result += processToken(ctx, reader)
        reader.consume()
    }

    return ctx.getValue(result)
}

function processExpression(ctx: CommandContext, reader: TokenizedReader<TokenizedKey>): string {
    let result = ""
    reader.consume()
    while (reader.peekCurrent() != "}}") {
        result += processToken(ctx, reader)
        reader.consume()
    }

    const expr = parseExpression(result)
    return expr.type.run(ctx, expr)
}