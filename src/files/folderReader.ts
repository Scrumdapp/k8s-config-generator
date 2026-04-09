import * as FS from "node:fs";
import * as PATH from "node:path"
import {SourceFolder} from "./sourceFolder";

export const schema_file_name = "_schema.yaml"

export function getTemplates(baseDir: string) {
    if (!FS.existsSync(baseDir)) {
        throw new Error(`'${baseDir}' does not exist`)
    }

    const stats = FS.statSync(baseDir)
    if (!stats.isDirectory()) {
        throw new Error(`'${baseDir}' is not a Directory`)
    }

    const d = FS.readdirSync(baseDir)
    const templates: string[] = []

    for (const file of d) {
        const p = PATH.join(baseDir, file, schema_file_name)
        if (!FS.existsSync(p)) {
            continue
        }

        if (!FS.statSync(p).isFile()) {
            throw new Error(`'${p}' is not a file`)
        }

        templates.push(file)
    }

    return templates;
}

export function getTemplateFiles(dir: string): string[] {
    if (!FS.existsSync(dir)) {
        throw new Error(`'${dir}' does not exist`)
    }

    const stats = FS.statSync(dir)
    if (!stats.isDirectory()) {
        throw new Error(`'${dir}' is not a Directory`)
    }

    const d = FS.readdirSync(dir)
    if (!d.find(it => it == schema_file_name)) {
        throw new Error(`'${dir}' does not contain a '${schema_file_name}' file`)
    }

    return d.filter(it => PATH.extname(it) == ".yaml").filter(it => it != schema_file_name)

}

export function getSourceFiles(dir: string): SourceFolder {
    if (!FS.existsSync(dir)) {
        throw new Error(`'${dir}' does not exist`)
    }

    const stats = FS.statSync(dir)
    if (!stats.isDirectory()) {
        throw new Error(`'${dir}' is not a Directory`)
    }

    const files = FS.readdirSync(dir)
    const result: SourceFolder = { path: dir, folders: [], files: [], fileCount: 0 }
    for (let file of files) {
        const path = PATH.join(dir, file)
        const stats = FS.statSync(path)
        if (stats.isFile()) {
            result.files.push(path)
            result.fileCount++
        } else if (stats.isDirectory()) {
            const subConfig = getSourceFiles(path)
            result.fileCount += subConfig.fileCount
            result.folders.push(subConfig)
        }
    }

    return result
}