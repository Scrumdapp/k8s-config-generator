
const tokenizeRegex = /( |"|[^" ]+)/g

export function tokenizeExpression(text: string): string[] {
    const result = []

    let str: string | null = null

    for (let r of text.matchAll(tokenizeRegex)) {
        const txt = r[0]

        if (str != null) {
            if (txt == '"') {
                result.push(str)
                result.push('"')
                str = null
                continue
            }
            str = str == '' ? txt : `${str}${txt}`
            continue
        }

        if (txt == '"') {
            result.push('"')
            str = ''
            continue
        }

        if (txt == " ") {
            continue
        }

        result.push(txt)
    }

    if (str != null) {
        throw new Error(`String in expression '${text}' did not close`)
    }

    return result;
}