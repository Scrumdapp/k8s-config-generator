import {TokenizedText} from "../textProcessing/tokenizer";

export class CommandContext {
    // @ts-ignore
    workDir: string

    private data = new Map<string, any>()
    private templates = new Map<string, TokenizedText>()

    containsValue(name: string) {
        return this.data.has(name)
    }

    getValue(name: string) {
        return this.data.get(name)
    }

    setValue(name: string, value: any) {
        this.data.set(name, value)
    }

    getTemplate(name: string) {
        return this.templates.get(name)
    }

    setTemplates(templates: Map<string, TokenizedText>) {
        this.templates = new Map(templates)
    }
}