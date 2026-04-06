import {ExpressionDefinition} from "@src/textProcessing/expression/expressionBuilder";
import {TextExpression} from "@src/textProcessing/expression/textExpression";

export class Expression {
    readonly type: TextExpression
    readonly values: Map<string, ExpressionValue>

    constructor(type: TextExpression, values: Map<string, ExpressionValue>) {
        this.type = type;
        this.values = values;
    }

    getString(name: string) {
        const v = this.values.get(name)
        if (typeof v == "undefined") {
            throw new Error(`Expression with name '${name}' does not exist`)
        }

        if (v.definition.type !== "STR") {
            throw new Error(`Expression '${v.definition.name}' does not have type 'STR'`)
        }

        return v.value as string
    }

    getVariableName(name: string) {
        const v = this.values.get(name)
        if (typeof v == "undefined") {
            throw new Error(`Expression with name '${name}' does not exist`)
        }

        if (v.definition.type !== "VAR") {
            throw new Error(`Expression '${v.definition.name}' does not have type 'VAR'`)
        }

        return v.value as string
    }
}

export interface ExpressionValue {
    definition: ExpressionDefinition
    value: any
}