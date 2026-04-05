
export class ExpressionBuilder {

    private format: ExpressionDefinition[] = []

    constructor(cmdName: string) {
        this.keyword(cmdName)
    }

    keyword(keyword: string) {
        this.format.push({
            name: keyword,
            type: "KEY"
        })
        return this
    }

    string(name: string) {
        this.format.push({
            name: name,
            type: "STR"
        })
        return this
    }

    build() {
        return [...this.format]
    }

}

export type ExpressionType = 'KEY' | 'STR'

export interface ExpressionDefinition {
    name: string
    type: ExpressionType,
}