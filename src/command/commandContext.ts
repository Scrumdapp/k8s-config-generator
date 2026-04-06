
export class CommandContext {
    private data: { [key: string]: any } = {}

    containsValue(name: string) {
        return this.data.hasOwnProperty(name)
    }

    getValue(name: string) {
        return this.data[name]
    }

    setValue(name: string, value: any) {
        this.data[name] = value
    }
}