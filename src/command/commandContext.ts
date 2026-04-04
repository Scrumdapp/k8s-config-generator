
export class CommandContext {
    private data: { [key: string]: any } = {}

    getValue(name: string) {
        return this.data[name]
    }

    setValue(name: string, value: any) {
        this.data[name] = value
    }
}