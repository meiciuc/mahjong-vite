export function throwIfNull<T>(value: NonNullable<T> | null | undefined, message?: string): NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error(message);
    }

    return value;
}
