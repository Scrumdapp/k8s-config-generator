import { program } from "commander"
import {getSourceFiles, getTemplates} from "../files/folderReader";
import chalk from "chalk";
import {createDirRecursive, verifyDirectory} from "../utils/fsUtils";
import {ProjectContext, ProjectTemplate} from "../project/projectContext";
import * as PATH from "node:path"
import {processProjectContext} from "../project/processProjectContext";

program
    .option("-s, --source <DIRECTORY>", "The directory housing all config files", "schemes")
    .option("-t, --templates <DIRECTORY>", "The directory that houses all the templates", "templates")
    .option("-o, --output <DIRECTORY>", "The output directory", "config")

program.parse()

const opts = program.opts()
const templatesDir = opts["templates"] as string
const sourceDir = opts["source"] as string
const outputDir = opts["output"] as string

console.log(`
${chalk.bold("Scrumdapp")} k8s config generator
${chalk.bold("-")} source dir:    ${chalk.yellow(sourceDir)}
${chalk.bold("-")} templates dir: ${chalk.yellow(templatesDir)}
${chalk.bold("-")} output dir:    ${chalk.yellow(outputDir)}
`)

if (!verifyDirectory(sourceDir)) {
    console.log(`${chalk.bgRed("ERROR:")} source dir '${chalk.yellow(sourceDir)}' does not exist`)
    process.exit(1)
}

if (!verifyDirectory(templatesDir)) {
    console.log(`${chalk.bgRed("ERROR:")} templates dir '${chalk.yellow(templatesDir)}' does not exist`)
    process.exit(1)
}

if (!verifyDirectory(outputDir)) {
    console.log(`${chalk.bgYellow.black("WARN:")} output dir '${chalk.yellow(outputDir)}' does not exist, creating dir`)
    createDirRecursive(outputDir)
}

const templates = getTemplates(templatesDir)

if (templates.length == 0) {
    console.log(`${chalk.bgRed("ERROR:")} No templates found in '${chalk.yellow(templatesDir)}'`)
    process.exit(1)
}

console.log(chalk.bold("Templates found:") + "\n" + templates.map(it => `${chalk.bold("-")} ${chalk.green(it)}`).join("\n") + "\n")

const sources = getSourceFiles(sourceDir)

if (sources.fileCount == 0) {
    console.log(`${chalk.bgRed("ERROR:")} No source files found in '${chalk.yellow(sourceDir)}'`)
    process.exit(1)
}

console.log(`Found ${chalk.yellow(sources.fileCount)} source file${sources.fileCount == 1 ? '' : 's'}`)

const projectTemplates = new Map<string, ProjectTemplate>();
for (let template of templates) {
    projectTemplates.set(template, {
        path: PATH.join(templatesDir, template)
    })
}

const projectContext = new ProjectContext(sources, projectTemplates)
processProjectContext(outputDir, projectContext.sources, projectContext)