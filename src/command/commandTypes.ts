import {CommandType} from "./commandType";
import {setCommand} from "./commands/setCommand";
import {echoCommand} from "./commands/echoCommand";
import {copyCommand} from "./commands/copyCommand";

export const commandTypes = new Map<string, CommandType>()

export function getCommandType(schema: any): CommandType {
    if (typeof schema !== "object") {
        throw new Error("Schema must be an obj type")
    }

    const keys = Object.keys(schema);
    if (keys.length == 0) {
        throw new Error("No command was defined")
    }

    const cmd = commandTypes.get(keys[0]!)
    if (!cmd) {
        throw new Error(`Command '${keys[0]}' does not exist`)
    }

    return cmd
}

function addTypes() {
    // commandContainer should not be registered
    addCommandType(setCommand)
    addCommandType(echoCommand)
    addCommandType(copyCommand)
}

function addCommandType(type: CommandType) {
    if (commandTypes.has(type.cmd)) {
        throw new Error(`Schema type '${type.cmd}' already exists`)
    }

    commandTypes.set(type.cmd, type)
}

addTypes()