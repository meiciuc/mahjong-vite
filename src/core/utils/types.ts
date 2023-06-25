export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? DeepPartial<U>[]
        : T[P] extends object
            ? DeepPartial<T[P]>
            : T[P];
};

export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends (infer U)[]
        ? DeepRequired<U>[]
        : T[P] extends object
            ? DeepRequired<T[P]>
            : T[P];
};

export type DeepReadonly<T>
    = T extends Array<infer U>
        ? ReadonlyArray<DeepReadonly<U>>
        : T extends object
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : Readonly<T>;

// TODO: we will use some sort of base Primrtive (when it exists)
// instead of this SceneObject interface
export interface SceneObject {
    x: number;
    y: number;
    scale: number;
    scaleX: number;
    scaleY: number;
}

// Get the first element of type tuple
// Example: TupleHead<['a', 'b']> -> 'a'
export type TupleHead<T extends unknown[]> = T extends [infer Head, ...unknown[]] ? Head : never;

// Get the rest elements without first of type tuple
// Example: TupleTail<['a', 'b', 'c']> -> ['b', 'c']
export type TupleTail<T extends unknown[]> = T extends [unknown, ...infer Tail] ? Tail : [];

// Check if type is optional
type CheckOptional<T, True, False> = { key: Exclude<T, null> } extends { key: NonNullable<T> } ? False : True;

// Get nested object property type by it path, if any type on this
// path is optional, then result type will be optional
// Example: GetPropertyType<{ a: { b: number }}, ['a', 'b']> -> number
type GetPropertyTypeInternal<T, Path extends string[], Optional>
    = Path extends []
        ? CheckOptional<Optional, true, false> extends true
            ? T | undefined
            : T
        : TupleHead<Path> extends keyof T
            ? GetPropertyTypeInternal<
                Exclude<T[TupleHead<Path>], undefined>,
                TupleTail<Path>,
                CheckOptional<Optional | T[TupleHead<Path>], undefined, never>
            >
            : never;

export type GetPropertyType<T, Path extends string[]> = GetPropertyTypeInternal<T, Path, never>;

// Check if path to nested object property correct, if so return same path, ErrorIndicator instead
type CheckPropertyPath<T extends object, Path extends string[], ErrorIndicator extends unknown[]>
    = Path extends []
        ? []
        : TupleHead<Path> extends keyof T
            ? NonNullable<T[TupleHead<Path>]> extends object
                ? [TupleHead<Path>, ...CheckPropertyPath<NonNullable<T[TupleHead<Path>]>, TupleTail<Path>, ErrorIndicator>]
                : [TupleHead<Path>]
            : ErrorIndicator;

// Check if path to nested object property correct, if so return same path, never instead
export type ValidatePropertyPath<T extends object, Path extends string[]> = CheckPropertyPath<T, Path, never>;

// Return longest correct path to nested object property, remove part with unknown properties
// Example: GetClosestPropertyPath<{ a: { b: number }}, ['a', 'c']> -> ['a']
export type GetClosestPropertyPath<T extends object, Path extends string[]> = CheckPropertyPath<T, Path, []>;

// Get uniun of available property types by path
// Example: GetAvailablePropertyPaths<{ a: { b: number, c: string }}, ['a']> -> ['a', 'b'] | ['a', 'c']
export type GetAvailablePropertyPaths<T, Path extends string[]> = {
    [K in keyof NonNullable<GetPropertyType<T, Path>> & string]: [...Path, K]
}[keyof NonNullable<GetPropertyType<T, Path>> & string];

// get optional keys of T
export type OptionalKeys<T> = {
    [K in keyof T]-?: (Record<string, never> extends { [P in K]: T[K] } ? K : never)
}[keyof T];

// Check if any property along path is optional
export type CheckOptionalPropertyPath<T, Path extends string[], True, False>
    = Path extends []
        ? False
        : TupleHead<Path> extends keyof T
            ? TupleHead<Path> extends OptionalKeys<T>
                ? True
                : T[TupleHead<Path>] extends object
                    ? CheckOptionalPropertyPath<T[TupleHead<Path>], TupleTail<Path>, True, False>
                    : False
            : False;

// StrictUnion accepts only A or B, not A | B
export type StrictUnion<A extends object, B extends object> =
    { [K in keyof A]: A[K] } & { [K in keyof B]?: never } |
    { [K in keyof A]?: never } & { [K in keyof B]: B[K] };
