import {SourceFolder} from "../files/sourceFolder";
import {ProjectContext} from "./projectContext";
import * as FS from "node:fs";
import {parseYaml} from "../files/parse-yaml";
import * as PATH from "node:path";

export function processProjectContext(workDir: string, sources: SourceFolder, projectCtx: ProjectContext) {

    for (let filePath of sources.files) {
        const str = FS.readFileSync(filePath, 'utf-8')
        const values = parseYaml(str)

        if (!values.hasOwnProperty("_template")) {
            throw new Error(`Config ${filePath}: no _template property found`)
        }

        const template = projectCtx.getTemplate(values._template)
        template.run(PATH.join(workDir, PATH.basename(filePath, ".yaml")), values)
    }

    for (let folder of sources.folders) {
        processProjectContext(PATH.join(workDir, PATH.basename(folder.path)), folder, projectCtx)
    }

}