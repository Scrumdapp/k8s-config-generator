import * as FS from "node:fs";

export function verifyDirectory(dir: string) {
    const exists = FS.existsSync(dir);
    if (!exists) {
        return false;
    }

    const stat = FS.statSync(dir)
    return stat.isDirectory()
}

export function createDirRecursive(dir: string) {
    FS.mkdirSync(dir, { recursive: true })
}