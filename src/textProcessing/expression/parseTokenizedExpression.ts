import {Expression, ExpressionValue} from "@src/textProcessing/expression/expression";
import {getTextExpressionType} from "@src/textProcessing/expression/textExpression";
import {TokenizedReader} from "@src/textProcessing/tokenizedReader";
import {tokenizeExpression} from "@src/textProcessing/tokenizeExpression";

export function parseExpression(expression: string) {
    return parseTokenizedExpression(tokenizeExpression(expression));
}

export function parseTokenizedExpression(tokenized: string[]): Expression {
    const cmdName = tokenized[0].toLowerCase()
    const expr = getTextExpressionType(cmdName)
    const values = new Map<string, ExpressionValue>()

    // misuse bcs of types but dc
    const reader = new TokenizedReader(tokenized);

    for (let definition of expr.cmd) {
        switch (definition.type) {
            case "KEY": {
                const key = reader.consume()
                if (key.toLowerCase() != definition.name) {
                    throw new Error(`${cmdName}: Key '${key}' did not match ${definition.name}`)
                }
                break
            }
            case "STR": {
                if (reader.consume() != '"') {
                    throw new Error(`${cmdName}: Expected '"' but got '${reader.peekCurrent()}'`)
                }

                let v = reader.consume()
                if (v == '"') {
                    values.set(definition.name, {
                        definition: definition,
                        value: ""
                    })
                    break
                }

                values.set(definition.name, {
                    definition: definition,
                    value: v
                })

                if (reader.consume() != '"') {
                    throw new Error(`${cmdName}: Expected '"' but got '${reader.peekCurrent()}'`)
                }
                break
            }
            case "VAR": {
                const v = reader.consume()
                if (v == '"') {
                    throw new Error(`${cmdName}: Expected 'name' but got '"'`)
                }
                values.set(definition.name, {
                    definition: definition,
                    value: v
                })
                break
            }
            default:
                throw new Error(`${cmdName}: Unkown type on definition ${definition.name}`)
        }
    }

    return new Expression(expr, values)
}