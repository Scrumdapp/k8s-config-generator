export class TokenizedReader<T> {
    public index = -1
    private readonly line: T[]

    constructor(line: T[]) {
        this.line = line;
    }

    public hasNext() {
        return this.index + 1 < this.line.length
    }

    public peekNext() {
        this.throwOutOfBounds(1)
        return this.line[this.index+1]
    }

    public peekCurrent() {
        this.throwOutOfBounds()
        return this.line[this.index]
    }

    public consume() {
        this.throwOutOfBounds(1)
        return this.line[++this.index]
    }

    private throwOutOfBounds(offset = 0) {
        if (this.index + offset >= this.line.length) {
            throw new Error("Tokenizer out of bounds!")
        }
    }
}