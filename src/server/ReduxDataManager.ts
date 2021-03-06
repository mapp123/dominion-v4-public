import type {StructDef, StructForm} from "superstruct";
import {
    applyMiddleware,
    compose,
    createStore,
    Store,
    StoreEnhancer,
    StoreEnhancerStoreCreator
} from "redux";
import Card from "../cards/Card";
import Cost from "./Cost";
import * as iPO from "is-plain-object";

const isPlainObject = typeof iPO === 'function' ? iPO : iPO.default;

type Action = SetAction | ReplaceAction | DeepSetAction | SpliceAction;
interface SetAction {
    type: 'ACTION_SET';
    key: string;
    value: any;
}
interface ReplaceAction {
    type: 'STATE_REPLACE';
    value: any;
}
interface DeepSetAction {
    type: 'DEEP_SET';
    keyMap: Array<string | number | symbol>;
    value: any;
}
interface SpliceAction {
    type: 'DEEP_SPLICE';
    keyMap: Array<string | number | symbol>;
    start: number;
    deleteCount: number;
    addToArray: any[];
}

const rehydrateable = {
    cost: Cost
};

export function rehydrate<T extends object>(obj: T, iter = 0): T {
    if (obj == null || typeof obj !== 'object' || !isPlainObject(obj)) return obj;
    if (typeof obj["_rehydrateWith"] !== 'undefined') {
        return rehydrateable[obj["_rehydrateWith"]].fromJSON(obj);
    }
    try {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
            if (Array.isArray(value)) return [key, value.map((a) => rehydrate(a, iter + 1))];
            if (value == null) return [key, value];
            if (typeof value === 'object') return [key, rehydrate(value, iter + 1)];
            return [key, value];
        }));
    }
    // eslint-disable-next-line no-empty
    catch {}
    return obj;
}

function dataManagerReducer<T extends StructDef<{}>>(state: StructForm<{}, T> | undefined, action: Action): StructForm<{}, T> {
    if (state === undefined) {
        // I don't care about this test, it is an impossible case as far as I'm aware.
        // istanbul ignore next
        return {} as any as StructForm<{}, T>;
    }
    switch (action.type) {
        case "ACTION_SET":
            return {
                ...state,
                [action.key]: rehydrate(action.value)
            };
        case "STATE_REPLACE":
            return rehydrate(action.value);
        case "DEEP_SET":
            const top: any = {...state};
            let currentTarget = top;
            action.keyMap.slice(0, -1).forEach((key) => {
                if (Array.isArray(currentTarget[key])) {
                    currentTarget[key] = [...currentTarget[key]];
                }
                else {
                    currentTarget[key] = {
                        ...currentTarget[key]
                    };
                }
                currentTarget = currentTarget[key];
            });
            currentTarget[action.keyMap.slice(-1)[0]] = rehydrate(action.value);
            return top;
        case "DEEP_SPLICE":
            const topA: any = {...state};
            let currentTargetA = topA;
            action.keyMap.slice(0, -1).forEach((key) => {
                if (Array.isArray(currentTargetA[key])) {
                    currentTargetA[key] = [...currentTargetA[key]];
                }
                else {
                    currentTargetA[key] = {
                        ...currentTargetA[key]
                    };
                }
                currentTargetA = currentTargetA[key];
            });
            const lastKey = action.keyMap.slice(-1)[0];
            currentTargetA[lastKey] = currentTargetA[lastKey].slice(0, action.start).concat(rehydrate(action.addToArray)).concat(currentTargetA[lastKey].slice(action.start + action.deleteCount));
            return topA;
    }
    return state!;
}
function fakeSplice(dispatch: (a: Action) => any, target: any, keyMap: Array<string | number | symbol>, start: number, deleteCount?: number, ...addToArray: any[]) {
    if (!deleteCount) {
        deleteCount = target.length - start;
    }
    dispatch({
        type: 'DEEP_SPLICE',
        keyMap,
        start,
        deleteCount,
        addToArray
    });
    return target.slice(start, start + (deleteCount || target.length - start)).map((obj) => {
        // OBJ is leaving redux, remove any proxies
        while (obj != null && obj.__isProxy) {
            obj = obj.__underlyingValue;
        }
        return obj;
    });
}
function createDeepObjectInspection<T extends object>(dispatch: (a: Action) => any, currentKeyMap: Array<string | number | symbol>, object: T, store: any): T {
    return new Proxy(object, {
        get(target: T, p: string | number | symbol): any {
            if (p === '__isProxy') {
                return true;
            }
            let currentTarget = store.getState();
            currentKeyMap.forEach((a) => {
                currentTarget = currentTarget[a];
            });
            if (p === '__underlyingValue') {
                return currentTarget;
            }
            if (currentTarget[p] != null && !(currentTarget[p] instanceof Card) && typeof currentTarget[p] === 'object') {
                return createDeepObjectInspection(dispatch, [...currentKeyMap, p], currentTarget[p], store);
            }
            if (p === 'splice') {
                return fakeSplice.bind(currentTarget, dispatch, currentTarget, currentKeyMap);
            }
            return currentTarget[p];
        },
        set(target: T, p: string | number | symbol, value: any): boolean {
            let currentTarget = store.getState();
            currentKeyMap.forEach((a) => {
                currentTarget = currentTarget[a];
            });
            if (p === "length" && currentTarget[p] < value) {
                // Don't serialize useless length values across the network.
                return true;
            }
            while (value != null && value.__isProxy) {
                value = value.__underlyingValue;
            }
            dispatch({
                type: "DEEP_SET",
                keyMap: [...currentKeyMap, p],
                value: value
            });
            return true;
        }
    });
}
type ReplaceState<T> = {state: T};
type SubscribeFunction = (action: Action) => boolean;
type Subscribe = {onAction: (f: SubscribeFunction) => void};
type HaltNotifications = {haltNotifications: (f: () => Promise<any>) => Promise<any>};
type HookDictionary<T extends StructDef<{}>> = {
    [key in keyof T]: Array<(oldValue: StructForm<{}, T>[key], nextValue: StructForm<{}, T>[key]) => StructForm<{}, T>[key]> | undefined
}
type Hooks<T extends StructDef<{}>> = {hooks: HookDictionary<T>};
function makeEnhancer<T extends StructDef<{}>>(keys: T): StoreEnhancer<StructForm<{}, T> & ReplaceState<StructForm<{}, T>> & Subscribe & HaltNotifications & Hooks<T>, {}> {
    let subscribers: SubscribeFunction[] = [];
    let halted = false;
    const hooks: HookDictionary<T> = {} as HookDictionary<T>;
    return compose((creator: StoreEnhancerStoreCreator) => {
        return (reducer, preloadedState) => {
            const store = creator(reducer, preloadedState);
            Object.keys(keys).forEach((key) => {
                Object.defineProperty(store, key, {
                    get() {
                        const k = this.getState()[key];
                        if (k != null && !(k instanceof Card) && typeof k === 'object') {
                            return createDeepObjectInspection(this.dispatch, [key], k, store);
                        }
                        return k;
                    },
                    set(value) {
                        const oldValue = store.getState()[key];
                        if (typeof hooks[key] !== 'undefined' && hooks[key]!.length > 0) {
                            for (const hook of hooks[key]!) {
                                value = hook(oldValue, value);
                            }
                        }
                        return this.dispatch({
                            type: 'ACTION_SET',
                            key,
                            value
                        });
                    }
                });
            });
            Object.defineProperty(store, 'hooks', {
                get: () => {
                    return hooks;
                },
                configurable: false
            });
            Object.defineProperty(store, 'state', {
                get() {
                    return this.getState();
                },
                set(value) {
                    return this.dispatch({
                        type: 'STATE_REPLACE',
                        value
                    });
                }
            });
            Object.defineProperty(store, 'onAction', {
                get() {
                    return (f) => {
                        subscribers.push(f);
                    };
                }
            });
            Object.defineProperty(store, 'haltNotifications', {
                get() {
                    return async (haltFunction: () => Promise<any>) => {
                        halted = true;
                        await haltFunction();
                        halted = false;
                        // TODO: Optimize to just changed keys
                        this.dispatch({
                            type: 'STATE_REPLACE',
                            value: this.getState()
                        });
                    };
                }
            });
            return store as any;
        };
    },
    applyMiddleware(() => next => action => {
        const returnValue = next(action);
        if (!halted) {
            subscribers = subscribers.filter((a) => a(action));
        }
        else {
            // @ts-ignore
            subscribers.filter((a) => a.__ignoreHalt).forEach((a) => a(action));
        }
        return returnValue;
    })
    );
}
function logger({ getState }) {
    return next => action => {
        if (process.env.NODE_ENV === 'test' || typeof window !== 'undefined') {
            console.log('will dispatch', action);
        }

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action);
        if (process.env.NODE_ENV === 'test' || typeof window !== 'undefined') {
            console.log('state after dispatch', getState());
        }

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    };
}
export default function ReduxDataManager<T extends StructDef<{}>>(keys: T, defaults: StructForm<{}, T>): Store<StructForm<{}, T>, Action> & StructForm<{}, T> & ReplaceState<StructForm<{}, T>> & Subscribe & HaltNotifications & Hooks<T> {
    // Must be typed this way to avoid blowing up the stack
    return createStore<any, any, any, any>(
        dataManagerReducer,
        defaults,
        compose(
            makeEnhancer(keys),
            applyMiddleware(logger)
        )
    );
}