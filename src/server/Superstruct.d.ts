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
    type UnionToIntersection<U> =
        (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
    type ValidTypes<ExtraTypes> = (keyof (ExtraTypes & Types)) | StructDef<ExtraTypes> | ValidTypeArray<ExtraTypes> | Struct<any> | string;
    export type StructDef<ExtraTypes> = {
        [key: string]: ValidTypes<ExtraTypes>;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ValidTypeArray<ExtraTypes> extends ReadonlyArray<ValidTypes<ExtraTypes>> {}
    type ArrayStructForm<ExtraTypes, Def extends ValidTypeArray<ExtraTypes>> = {
        -readonly [P in keyof Def]: Def[P] extends ValidTypes<ExtraTypes> ? GetType<ExtraTypes, Def[P]> : never;
    }
    type GetType<ExtraTypes, Def extends ValidTypes<ExtraTypes>> = Def extends Struct<any> ? ReturnType<Def> : Def extends StructDef<ExtraTypes> ? StructForm<ExtraTypes, Def> : Def extends ValidTypeArray<ExtraTypes> ? ArrayStructForm<ExtraTypes, Def> : Def extends (keyof (Types & ExtraTypes)) ? (Types & ExtraTypes)[Def] : any;
    export type StructForm<ExtraTypes, Def extends StructDef<ExtraTypes>> = {
        -readonly [P in keyof Def]: GetType<ExtraTypes, Def[P]>;
    }
    interface Struct<ExtraTypes> {
        (obj: any): ExtraTypes;
        assert(obj: any): ExtraTypes;
        test(obj: any): boolean;
        validate(obj: any): [StructError, null] | [undefined, ExtraTypes];
    }
    export const struct: struct<{}>;
    export function superstruct<ExtraTypes extends object>(options: object): struct<ExtraTypes>;
    type Literals = string | number | boolean | bigint | symbol;
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    export interface struct<ExtraTypes> {
        <K extends ValidTypes<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K>>;
        any<K extends ValidTypes<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K>>;
        dict<K extends ValidTypes<ExtraTypes>>(def: ['string', K]): Struct<{[key: string]: GetType<ExtraTypes, K>}>;
        dict<K extends ValidTypes<ExtraTypes>>(def: ['number', K]): Struct<{[key: number]: GetType<ExtraTypes, K>}>;
        enum<K extends readonly Literals[]>(def: K): Struct<K[number]>;
        function<T>(test: (value: any) => boolean): Struct<T>;
        instance<K>(constructorType: Function & {prototype: K}): Struct<K>;
        interface<K extends StructDef<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K>> & {[key: string]: any; [key: number]: any};
        intersection<K extends ValidTypeArray<ExtraTypes>>(def: K): Struct<UnionToIntersection<GetType<ExtraTypes, K[number]>>>;
        lazy<K extends Struct<any>>(resolver: () => K): Struct<ReturnType<K>>;
        dynamic<K extends Struct<any>>(resolver: (value: any, parent: any) => K): Struct<ReturnType<K>>;
        list<K extends ReadonlyArray<ValidTypes<ExtraTypes>>>(def: ExtraTypes): Struct<Array<GetType<ExtraTypes, K[0]>>>;
        literal<K extends Literals>(literal: K): Struct<K>;
        object<K extends StructDef<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K>>;
        optional<K extends ValidTypes<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K> | undefined>;
        partial<K extends StructDef<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K>>;
        scalar<K extends keyof Types>(type: K): Struct<GetType<ExtraTypes, K>>;
        tuple<K extends ReadonlyArray<ValidTypes<ExtraTypes>>>(def: K): Struct<GetType<ExtraTypes, K>>;
        union<K extends ValidTypeArray<ExtraTypes>>(def: K): Struct<GetType<ExtraTypes, K[number]>>;
    }
    export class StructError extends Error {
        data: any;
        path: string[];
        value: any;
        type: string;
        errors: StructError[];
    }
}