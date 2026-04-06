import {SchemaNode} from "@src/schema/schemaNode";
import {CommandNode} from "@src/command/commandNode";

export interface SchemaFile {
    schema: SchemaNode,
    commands: CommandNode
}