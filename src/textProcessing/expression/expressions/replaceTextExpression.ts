import {TextExpression} from "../textExpression";
import {ExpressionBuilder} from "../expressionBuilder";

export const replaceTextExpression: TextExpression = {
    cmd: new ExpressionBuilder("replace")
        .string("from")
        .keyword("with")
        .string("to")
        .keyword("in")
        .string("text")
        .build(),

    run: (ctx, expr) => {
        const from = expr.getString("from")
        const to = expr.getString("to")
        const text = expr.getString("text")

        return text.replaceAll(from, to)
    }
}