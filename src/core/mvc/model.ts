import { proxy, getVersion, subscribe, ref } from 'valtio/vanilla';
import {
    DeepReadonly,
    GetAvailablePropertyPaths,
    GetClosestPropertyPath,
    GetPropertyType,
    ValidatePropertyPath
} from '../utils/types';
import { Signal } from '../utils/signal';
import { clone } from '../utils/utils';

// recurcive set source to target[key], or target if no key
function setter(target: unknown, source: unknown, key: string | number | null) {
    if (key === null) {
        for (const prop in (source as Record<string, unknown>)) {
            if (!Object.prototype.hasOwnProperty.call(source, prop)) {
                continue;
            }

            if (!(prop in (target as Record<string, unknown>))) {
                target[prop] = source[prop];
            } else {
                setter(target, source[prop], prop);
            }
        }
        return;
    }

    if (!(key in (target as object)) || source === null) {
        target[key] = source;
        return;
    }

    if (Array.isArray(source)) {
        if (!Array.isArray(target[key])) {
            target[key] = source;
            return;
        }

        const t = target[key];
        for (let i = 0; i < source.length; ++i) {
            setter(t, source[i], i);
        }

        if (t.length > source.length) {
            t.splice(source.length, t.length - source.length);
        }
    } else if (typeof source === 'object') {
        if (typeof target[key] !== 'object' || target[key] === null) {
            target[key] = source;
            return;
        }

        const t = target[key];
        for (const prop in (source as Record<string, unknown>)) {
            if (!Object.prototype.hasOwnProperty.call(source, prop)) {
                continue;
            }

            if (!(prop in t)) {
                t[prop] = source[prop];
            } else {
                setter(t, source[prop], prop);
            }
        }
    } else {
        target[key] = source;
    }
}


const VAULT = Symbol();
interface PathHolder {
    [VAULT]?: { path: string[] };
}

export type Listener<Data, Path extends readonly string[] = []> = (
    newValue: DeepReadonly<GetPropertyType<Data, Path>>,
    prevValue: DeepReadonly<GetPropertyType<Data, Path>>
) => void;
export type Context = unknown;
export type PropertyPath<Data, Path extends readonly string[]>
    = Data extends object
    ? ValidatePropertyPath<Data, Path> extends never
    ? GetAvailablePropertyPaths<Data, GetClosestPropertyPath<Data, Path>>
    : Path
    : [];

export class Model<Data> {
    private static readonly submodelsCache = new WeakMap<object, Map<string, Model<unknown>>>();
    private dataPrev: Data;
    private dataProxy: Data & object;
    private readonly path: readonly string[];
    private signal: Signal<DeepReadonly<Data>, DeepReadonly<Data>>;

    constructor(data: Data & object) {
        this.path = (data as PathHolder)?.[VAULT]?.path || [];

        // check if it is already valtio proxy, if so getVersion retun some non-null version
        if (getVersion(data)) {
            this.dataProxy = data;
            this.dataPrev = this.raw;
        } else {
            if (typeof data !== 'object' || data === null) {
                data = {} as Data & object;
            }

            this.dataProxy = proxy(data);
            this.dataPrev = clone(data);
        }

        // put root model in cache
        if (!this.path.length) {
            Model.getSubModelCache<Data>(this.dataProxy).set('', this);
        }
    }

    public get data(): Data {
        return this.path.length ? this.get() as Data : this.dataProxy;
    }

    public get raw(): Data {
        return clone(this.data);
    }

    public get<const Path extends readonly string[]>(
        path: PropertyPath<Data, Path> = [] as PropertyPath<Data, Path>
    ): GetPropertyType<Data, Path> {
        const fullPath = this.path.concat(path);
        let part = this.dataProxy as GetPropertyType<Data, Path>;

        for (const step of fullPath) {
            if (!part) {
                break;
            }
            part = part[step];
        }

        return part;
    }

    public set<const Path extends readonly string[]>(
        path: PropertyPath<Data, Path>,
        value: GetPropertyType<Data, Path>
    ): boolean {
        const fullPath = this.path.concat(path);
        if (!fullPath.length) {
            setter(this.dataProxy, value, null);
            return true;
        }

        let part = this.dataProxy;
        for (let i = 0; i < fullPath.length - 1; ++i) {
            if (!part) {
                break;
            }
            part = part[fullPath[i]];
        }

        if (!part) {
            return false;
        }

        // We have to options here, first one - use code like this
        // part[fullPath[fullPath.length - 1]] = clone(value);
        // we need clone, because value object can be in valtio proxy cache
        // and use old proxy (with old data). It works, but valtio create new
        // proxy object (if value is object). To prevent it we use setter
        // to recursively go down through array and objects. As downside of this
        // we got many notifications, but its more perfomant than create new proxy.
        setter(part, value, fullPath[fullPath.length - 1]);
        return true;
    }

    public getSubModel<const Path extends readonly string[]>(path: PropertyPath<Data, Path>): Model<GetPropertyType<Data, Path>> {
        // if empty path provided - return current model
        if (!path.length) {
            return this as unknown as Model<GetPropertyType<Data, Path>>;
        }

        const cache = Model.getSubModelCache<GetPropertyType<Data, Path>>(this.dataProxy);
        const fullPath = this.path.concat(path);
        const cacheKey = fullPath.join('.');
        let subModel = cache.get(cacheKey);
        if (subModel) {
            return subModel;
        }

        // every submodel holds root data object and path to needed
        // sub-object, use ref to not activate update on dataProxy and
        // VAULT symbol to hide path inside data object
        if (!this.dataProxy[VAULT]) {
            this.dataProxy[VAULT] = ref({});
        }
        this.dataProxy[VAULT].path = fullPath;
        subModel = new Model(this.dataProxy) as unknown as Model<GetPropertyType<Data, Path>>;
        this.dataProxy[VAULT].path = null;

        cache.set(cacheKey, subModel);

        return subModel;
    }

    public subscribe(listener: Listener<Data>): void;
    public subscribe(listener: Listener<Data>, context: Context): void;
    public subscribe<const Path extends readonly string[]>(
        path: PropertyPath<Data, Path>,
        listener: Listener<Data, Path>
    ): void;
    public subscribe<const Path extends readonly string[]>(
        path: PropertyPath<Data, Path>,
        listener: Listener<Data, Path>,
        context: Context
    ): void;
    public subscribe<const Path extends readonly string[]>(
        ...params:
            [Listener<Data, Path>]
            | [Listener<Data, Path>, Context]
            | [PropertyPath<Data, Path>, Listener<Data, Path>]
            | [PropertyPath<Data, Path>, Listener<Data, Path>, Context]
    ): void {
        let listener: Listener<Data, Path>;
        let context: Context = undefined;
        let path = [] as PropertyPath<Data, Path>;
        if (params.length === 1) {
            [listener] = params;
        } else if (params.length === 2) {
            if (Array.isArray(params[0])) {
                [path, listener] = params as [PropertyPath<Data, Path>, Listener<Data, Path>];
            } else {
                [listener, context] = params as [Listener<Data, Path>, Context];
            }
        } else {
            [path, listener, context] = params;
        }

        if (path.length) {
            this.getSubModel(path).subscribe(listener as unknown as Listener<GetPropertyType<Data, Path>>, context);
        } else {
            if (!this.signal) {
                this.signal = new Signal();
            }
            this.signal.on(listener as unknown as Listener<Data>, context);
        }
    }

    public unsubscribe(listener: Listener<Data>): void;
    public unsubscribe<const Path extends readonly string[]>(path: PropertyPath<Data, Path>, listener: Listener<Data, Path>): void;
    public unsubscribe<const Path extends readonly string[]>(
        ...params: [listener: Listener<Data, Path>] | [path: PropertyPath<Data, Path>, listener: Listener<Data, Path>]
    ) {
        let listener: Listener<Data, Path>;
        let path = [] as PropertyPath<Data, Path>;
        if (params.length === 1) {
            [listener] = params;
        } else {
            [path, listener] = params;
        }

        if (path.length) {
            this.getSubModel(path).unsubscribe(listener as unknown as Listener<GetPropertyType<Data, Path>>);
        } else {
            this.signal?.off(listener as unknown as Listener<Data>);
        }
    }

    public unsubscribeAll(context: Context) {
        const cache = Model.submodelsCache.get(this.dataProxy);
        if (!cache) {
            return;
        }

        for (const model of cache.values()) {
            model.signal?.offAll(context);
        }
    }

    public destroy() {
        const cacheKey = this.path.join('.');
        Model.submodelsCache.get(this.dataProxy)?.delete(cacheKey);

        this.signal?.offAll();
        this.dataProxy = null;
        this.dataPrev = null;
    }

    private dispatch() {
        if (!this.signal?.hasListners()) {
            return;
        }

        const dataCurrent = this.raw;
        this.signal.dispatch(dataCurrent as DeepReadonly<Data>, this.dataPrev as DeepReadonly<Data>);
        this.dataPrev = dataCurrent;
    }

    private static getSubModelCache<T>(data: object): Map<string, Model<T>> {
        let cache = this.submodelsCache.get(data) as Map<string, Model<T>>;
        if (cache) {
            return cache;
        }

        // for new data object create cache and subscribe
        cache = new Map();
        Model.submodelsCache.set(data, cache as Map<string, Model<unknown>>);

        subscribe(data, operations => {
            const paths = operations
                .filter(operation => operation[1].every(step => typeof step === 'string'))
                .map(operation => operation[1].join('.'));

            for (const [modelPath, model] of cache) {
                if (paths.some(path => modelPath.startsWith(path) || path.startsWith(modelPath))) {
                    model.dispatch();
                }
            }
        });

        return cache;
    }
}