import {SchemaFile} from "@src/files/schemaFile";
import {TokenizedText} from "@src/textProcessing/tokenizer";
import {readSchemaValues} from "@src/schema/schemaParser";

export class Template {

    readonly name: string
    readonly schemaFile: SchemaFile
    private readonly files: Map<string, TokenizedText>

    constructor(name: string, schemaFile: SchemaFile, files: Map<string, TokenizedText>) {
        this.name = name
        this.schemaFile = schemaFile
        this.files = files
    }

    getFiles() {
        return new Map(this.files)
    }

    run(workDir: string, values: any) {
        const schemaNode = this.schemaFile.schema
        const cmdNode = this.schemaFile.commands

        const ctx = readSchemaValues(values, schemaNode)
        ctx.workDir = workDir
        ctx.setTemplates(this.getFiles())

        cmdNode.command.run(ctx, cmdNode)
    }

}