
const tokenizeRegex = /(\$?{{?|}}?|[^{}$]+)/g
const matchSpecial = /^\$?{{|}}$/
const matchNotSpecial = /^(\$?{(?!{)|}(?!}))/

export type TokenizedKey = "${{" | "{{" | "}}" | string
export type TokenizedLine = TokenizedKey[]
export type TokenizedText = TokenizedLine[]

export function tokenize(text: string, commentToken: string): TokenizedText {
    const lines = text.split("\n")
    const tokens: string[][] = []

    for (let line of lines) {
        tokens.push(tokenizeLine(line))
    }

    return tokens;
}

export function tokenizeLine(text: string): TokenizedLine {
    let result: string[] = []


    for (let r of text.matchAll(tokenizeRegex)) {
        result.push(r[0])
    }

    let newResult: string[] = []

    let prev: string | null = null
    for (let t of result) {
        if (matchSpecial.test(t)) {
            if (prev != null) {
                newResult.push(prev)
                prev = null
            }
            newResult.push(t)
            continue
        }

        if (matchNotSpecial.test(t)) {
            prev = (prev ?? "") + t
            continue
        }

        if (prev != null) {
            t = prev + t
            prev = null
        }

        newResult.push(t)
    }

    if (prev != null) {
        newResult.push(prev)
    }

    result = newResult
    newResult = []
    let next: string | null = null
    for (let i = result.length; i --> 0;) {
        let t = result[i]
        if (matchSpecial.test(t)) {
            if (next != null) {
                newResult.push(next)
                next = null
            }
            newResult.push(t)
            continue
        }

        if (matchNotSpecial.test(t)) {
            next = t + (next ?? "")
            continue
        }

        if (next != null) {
            t = t + next
            next = null
        }

        newResult.push(t)
    }

    if (next != null) {
        newResult.push(next)
    }

    return newResult.reverse()
}