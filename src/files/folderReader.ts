import * as fs from "node:fs";
import * as path from "node:path"

export const schema_file_name = "_schema.yaml"

export function getTemplates(baseDir: string) {
    if (!fs.existsSync(baseDir)) {
        throw new Error(`'${baseDir}' does not exist`)
    }

    const stats = fs.statSync(baseDir)
    if (!stats.isDirectory()) {
        throw new Error(`'${baseDir}' is not a Directory`)
    }

    const d = fs.readdirSync(baseDir)
    const templates: string[] = []

    for (const file of d) {
        const p = path.join(baseDir, file, schema_file_name)
        if (!fs.existsSync(p)) {
            continue
        }

        if (!fs.statSync(p).isFile()) {
            throw new Error(`'${p}' is not a file`)
        }

        templates.push(file)
    }

    return templates;
}

export function getTemplateFiles(dir: string) {
    if (!fs.existsSync(dir)) {
        throw new Error(`'${dir}' does not exist`)
    }

    const stats = fs.statSync(dir)
    if (!stats.isDirectory()) {
        throw new Error(`'${dir}' is not a Directory`)
    }

    const d = fs.readdirSync(dir)
    if (!d.find(it => it == schema_file_name)) {
        throw new Error(`'${dir}' does not contain a '${schema_file_name}' file`)
    }

    return d.filter(it => path.extname(it) == ".yaml").filter(it => it != schema_file_name)

}
