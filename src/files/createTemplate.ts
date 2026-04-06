import * as PATH from "node:path"
import * as fs from "node:fs";
import {Template} from "./template";
import {getTemplateFiles, schema_file_name} from "./folderReader";
import {parseYaml, readSchemaFile} from "./parse-yaml";
import {TokenizedText, tokenizeFile} from "../textProcessing/tokenizer";

export function createTemplate(path: string): Template {
    const templateName = PATH.basename(path)

    const files = getTemplateFiles(path)
    const schemaFilePath = PATH.join(path, schema_file_name)

    const schemaFileTxt = fs.readFileSync(schemaFilePath, "utf-8")
    const schemaData = parseYaml(schemaFileTxt)
    const schemaFile = readSchemaFile(schemaData)

    const tokenizedFiles = new Map<string, TokenizedText>()
    for (let file of files) {
        const filePath = PATH.join(path, file)
        const fileText = fs.readFileSync(filePath, "utf-8")
        const tokenized = tokenizeFile(fileText)
        tokenizedFiles.set(file, tokenized)
    }

    return new Template(templateName, schemaFile, tokenizedFiles)
}