import {TextExpression} from "../textExpression";
import {ExpressionBuilder} from "../expressionBuilder";

export const existsExpression: TextExpression = {
    cmd: new ExpressionBuilder("exists")
        .variableName("value")
        .build(),

    run: (ctx, expr) => {
        const value = expr.getVariableName("value")
        return ctx.containsValue(value).toString()
    }
}