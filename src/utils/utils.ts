import seedrandom from 'seedrandom';

export function clamp(min: number, max: number, value: number): number {
    return Math.min(max, Math.max(min, value));
}

export function eq(a: number, b: number, eps: number = 0.001): boolean {
    return Math.abs(a - b) <= eps;
}

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

// TODO random with seed
export function shuffle(array: any[], seed = '') {
    seed = seed ? seed : '' + Math.random();
    const arng =   seedrandom.alea(seed);

    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
        // Pick a remaining element.
        randomIndex = Math.floor(arng() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

export namespace Route {
    export function searchParam(key: string): string {
        const query = window.location.search.substring(1);
        const params = query.split("&");
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            if (pair[0] === key) {
                return pair[1];
            }
        }
        return '';
    }
}