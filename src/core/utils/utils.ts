export function clone<Data>(source: Data): Data {
    if (!source) {
        return source;
    }

    if (Array.isArray(source)) {
        return source.map(item => clone(item)) as unknown as Data;
    } else if (typeof source === 'object') {
        const target: Data = {} as Data;

        for (const prop in source) {
            if (!Object.prototype.hasOwnProperty.call(source, prop)) {
                continue;
            }

            target[prop] = clone(source[prop]);
        }

        return target;
    }

    return source;
}