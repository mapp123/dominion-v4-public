declare module 'superstruct' {
    interface Types {
        'any': any;
        'any?'?: any;
        'arguments': any[];
        'arguments?'?: any[];
        'array': any[];
        'array?'?: any[];
        'boolean': boolean;
        'boolean?'?: boolean;
        'buffer': Buffer;
        'buffer?'?: Buffer;
        'date': Date;
        'date?'?: Date;
        'error': Error;
        'error?'?: Error;
        'function': () => void;
        'function?'?: () => void;
        'generatorfunction': GeneratorFunction;
        'generatorfunction?'?: GeneratorFunction;
        'map': Map<any, any>;
        'map?'?: Map<any, any>;
        'null': null;
        'null?'?: null;
        'number': number;
        'number?'?: number;
        'object': object;
        'object?'?: object;
        'promise': Promise<any>;
        'promise?'?: Promise<any>;
        'regexp': RegExp;
        'regexp?'?: RegExp;
        'set': Set<any>;
        'set?'?: Set<any>;
        'string': string;
        'string?'?: string;
        'symbol': symbol;
        'symbol?'?: symbol;
        'undefined': undefined;
        'undefined?'?: undefined;
        'weakmap': WeakMap<any, any>;
        'weakmap?'?: WeakMap<any, any>;
        'weakset': WeakSet<any>;
        'weakset?'?: WeakSet<any>;
    }
    type ValidTypes = (keyof Types) | StructDef | ReadonlyArray<keyof Types | StructDef | Struct<any>> | Struct<any>;
    export type StructDef = {
        [key: string]: ValidTypes;
    }
    type ArrayStructForm<T extends ReadonlyArray<(keyof Types) | StructDef | Struct<any>>> = {
        -readonly [P in keyof T]: T[P] extends (keyof Types) | StructDef | Struct<any> ? GetType<T[P]> : never;
    }
    type GetType<T extends ValidTypes> = T extends Struct<any> ? ReturnType<T> : T extends StructDef ? StructForm<T> : T extends ReadonlyArray<(keyof Types) | StructDef | Struct<any>> ? ArrayStructForm<T> : T extends (keyof Types) ? Types[T] : never;
    export type StructForm<T extends StructDef> = {
        [P in keyof T]: GetType<T[P]>;
    }
    interface Struct<T> {
        (obj: any): T extends ValidTypes ? GetType<T> : T;
        assert(obj: any): T extends ValidTypes ? GetType<T> : T;
        test(obj: any): boolean;
        validate(obj: any): [StructError, null] | [undefined, T extends ValidTypes ? GetType<T> : T];
    }
    export const struct: struct;
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    export interface struct {
        <T extends StructDef>(def: T): Struct<T>;
        interface<T extends StructDef>(def: T): Struct<T> & {[key: string]: any; [key: number]: any};
        list<T extends readonly ValidTypes[]>(def: T): Struct<Array<T[0]>>;
        enum<T extends readonly any[]>(def: T): Struct<T[number]>;
        dict<K extends keyof Types>(def: ['string', K]): Struct<{[key: string]: Types[K]}>;
        dict<K extends keyof Types>(def: ['number', K]): Struct<{[key: number]: Types[K]}>;
        tuple<T extends ReadonlyArray<keyof Types>>(def: T): Struct<ArrayStructForm<T>>;
        instance<T>(constructorType: Function & {prototype: T}): Struct<T>;
        scalar<T extends keyof Types>(type: T): Struct<GetType<T>>;
        literal<T extends string | number>(literal: T): Struct<T>;
    }
    export class StructError extends Error {
        data: any;
        path: string[];
        value: any;
        type: string;
        errors: StructError[];
    }
}