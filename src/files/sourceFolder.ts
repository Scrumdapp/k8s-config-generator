
export interface SourceFolder {
    path: string
    folders: SourceFolder[]
    files: string[]
    fileCount: number
}