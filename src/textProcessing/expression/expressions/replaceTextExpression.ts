import {TextExpression} from "@src/textProcessing/expression/textExpression";
import {ExpressionBuilder} from "@src/textProcessing/expression/expressionBuilder";

export const replaceTextExpression: TextExpression = {
    cmd: new ExpressionBuilder("replace")
        .string("from")
        .keyword("to")
        .string("to")
        .keyword("in")
        .string("text")
        .build(),

    run: (expr) => {
        const from = expr.getString("from")
        const to = expr.getString("to")
        const text = expr.getString("text")

        return text.replace(from, to)
    }
}