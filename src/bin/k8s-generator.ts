import { program } from "commander"

program
    .option("-t, --templates <DIRECTORY>", "The directory that houses all the templates", "templates")

program.parse()

const opts = program.opts()