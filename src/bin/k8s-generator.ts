import { program } from "commander"
import {getTemplates} from "../files/folderReader";

program
    .option("-s, --source <DIRECTORY>", "The directory housing all config files", "schemes")
    .option("-t, --templates <DIRECTORY>", "The directory that houses all the templates", "templates")
    .option("-o, --output <DIRECTORY>", "The output directory", "config")

program.parse()

const opts = program.opts()
const templatesDir = opts["templates"]
const sourceDir = opts["source"]
const outputDir = opts["output"]

const templates = getTemplates(templatesDir)
console.log(templates)