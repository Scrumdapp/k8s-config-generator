import {SchemaNode} from "../schema/schemaNode";
import {CommandNode} from "../command/commandNode";

export interface SchemaFile {
    schema: SchemaNode,
    commands: CommandNode
}