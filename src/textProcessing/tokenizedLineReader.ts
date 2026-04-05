import {TokenizedLine} from "@src/textProcessing/tokenizer";

export class TokenizedLineReader {
    private line: TokenizedLine
    private index = -1

    constructor(line: TokenizedLine) {
        this.line = line;
    }

    public hasNext() {
        return this.index < this.line.length
    }

    public peekNext() {
        return this.line[this.index+1]
    }

    public peekCurrent() {
        return this.line[this.index]
    }

    public consume() {
        return this.line[++this.index]
    }
}