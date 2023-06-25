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

export function compare(a: unknown, b: unknown): boolean {
    if (a === b) {
        return true;
    }

    const atype = typeof a;
    const btype = typeof b;

    if (atype !== btype) {
        return false;
    }

    // all non-objects must be strict equal
    if (atype !== 'object') {
        return false;
    }

    // if a null, b must be null too
    if (!a) {
        return false;
    }

    const aarray = Array.isArray(a);
    const barray = Array.isArray(b);
    if (aarray !== barray) {
        return false;
    }

    if (aarray) {
        return arrayCompare(a, b as unknown[], { cmp: compare, respectOrder: true });
    }

    const akeys = Object.keys(a);
    const bkeys = Object.keys(b);
    if (akeys.length !== bkeys.length) {
        return false;
    }

    for (const prop of akeys) {
        if (!compare((a as object)[prop], (b as object)[prop])) {
            return false;
        }
    }

    return true;
}

export function arrayCompare<T>(
    a: Array<T>,
    b: Array<T>,
    params: { cmp?: (v1: T, v2: T) => boolean; respectOrder?: boolean } = {}
): boolean {
    const {
        cmp = (v1, v2) => v1 === v2,
        respectOrder = false
    } = params;

    if (a.length !== b.length) {
        return false;
    }

    if (respectOrder) {
        for (let i = a.length; i >= 0; --i) {
            if (!cmp(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    if (arrayCompare(a, b, { cmp, respectOrder: true })) {
        return true;
    }

    const bb = [...b];
    for (let i = a.length; i >= 0; --i) {
        let found = false;
        for (let j = bb.length; j >= 0; --j) {
            if (cmp(a[i], bb[j])) {
                found = true;
                bb.splice(j, 1);
                break;
            }
        }

        if (!found) {
            return false;
        }
    }

    return true;
}