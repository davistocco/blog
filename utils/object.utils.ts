export function exclude(obj: any, keys: string[]): Omit<any, string> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key))
    )
}