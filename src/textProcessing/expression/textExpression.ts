import {ExpressionDefinition} from "@src/textProcessing/expression/expressionBuilder";
import {Expression} from "@src/textProcessing/expression/expression";
import {replaceTextExpression} from "@src/textProcessing/expression/expressions/replaceTextExpression";
import {existsExpression} from "@src/textProcessing/expression/expressions/existsExpression";
import {CommandContext} from "@src/command/commandContext";

export interface TextExpression {
    cmd: ExpressionDefinition[]
    run: (ctx: CommandContext, expr: Expression) => string
}

export const expressions = new Map<string, TextExpression>()

export function getTextExpressionType(name: string) {
    name = name.toLowerCase()
    const expr = expressions.get(name)
    if (!expr) {
        throw new Error(`Expression '${name}' does not exist`)
    }

    return expr
}

function addExpression(expression: TextExpression) {
    if (expressions.get(expression.cmd[0].name)) {
        throw new Error(`Schema type '${expression.cmd[0].name}' already exists`)
    }

    expressions.set(expression.cmd[0].name, expression)
}

function addExpressions() {
    addExpression(replaceTextExpression)
    addExpression(existsExpression)
}

addExpressions()