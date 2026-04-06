import * as YAML from 'yaml'
import {parseSchema} from "@src/schema/schemaParser";
import {parseCommands} from "@src/command/commandParser";
import {SchemaFile} from "@src/files/schemaFile";


export function readSchemaFile(convertedYaml: any) {
    if (typeof convertedYaml !== "object") {
        throw new Error("Converted yaml must be of type object")
    }

    if (!convertedYaml.hasOwnProperty("schema")) {
        throw new Error("Schema file is missing 'schema' root node")
    }

    if (!convertedYaml.hasOwnProperty("do")) {
        throw new Error("Schema file is missing 'do' root node")
    }

    if (Object.keys(convertedYaml).length > 2) {
        throw new Error("Schema file has more than 2 root nodes, only valid root nodes are 'schema' and 'do'")
    }

    const schemaNode = parseSchema(convertedYaml.schema)
    const commands = parseCommands(convertedYaml.do)

    return {
        schema: schemaNode,
        commands: commands
    } as SchemaFile
}


export function parseYaml(yaml: string) {
    return YAML.parse(yaml)
}
