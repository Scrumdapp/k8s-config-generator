
export interface TextExpression {
    cmd: string
    run: (expr: string) => string
}

export const expressions = new Map<string, TextExpression>()

function getExpression(name: string) {
    name = name.toLowerCase()
    const expr = expressions.get(name)
    if (!expr) {
        throw new Error(`Command '${name}' does not exist`)
    }

    return expr
}

function addExpression(expression: TextExpression) {
    if (expression.cmd) {
        throw new Error(`Schema type '${expression.cmd}' already exists`)
    }

    expressions.set(expression.cmd, expression)
}

function addExpressions() {

}

addExpressions()