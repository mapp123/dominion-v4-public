import {StructDef, StructForm, Types} from "superstruct";
import List = Mocha.reporters.List;

type Data<T extends StructDef> = StructForm<T> & {
    subscribe<K extends keyof T>(key: K, listener: (value: StructForm<T>[K]) => boolean): any;
}
type ListenerDict<T extends StructDef> = {
    [K in keyof T]?: Array<(value: StructForm<T>[K]) => boolean>;
}
const __listeners = '__listeners';
function standardGet<T extends StructDef>(target: T & {__listeners?: ListenerDict<T> | Array<(value: StructForm<T>) => boolean>}, key: keyof T): any {
    if (key === '__isProxy') {
        return true;
    }
    if (key === '__revokeListener') {
        return (listener: () => any) => {
            let listeners = target[__listeners];
            if (typeof listeners === 'undefined') {
                return;
            }
            if (Array.isArray(listeners)) {
                target[__listeners] = listeners.filter((a) => a !== listener);
            }
            else {
                let key = Object.keys(listeners).find((a) => listeners![a].includes(listener)) || '';
                listeners[key as any as keyof T] = listeners[key as any as keyof T]!.filter((a) => a !== listener);
            }
        };
    }
    return target[key];
}
function makeInternalProxy(target: any, onChange: () => any) {
    if (target.__isProxy) {
        // Already is proxy, just add our listener and move on
        let listeners = target[__listeners];
        if (Array.isArray(listeners)) {
            listeners.push(onChange);
            return target;
        }
        else {
            throw new Error("Shouldn't assign a full DataManager to another.");
        }
    }
    console.log(`setting __listeners on ${JSON.stringify(target)}`);
    target[__listeners] = [onChange];
    Object.keys(target).forEach((key) => {
        if (key === __listeners || key === '__isProxy') {
            return;
        }
        let a = target[key];
        if (typeof a === 'object') {
            target[key] = makeInternalProxy(a, onChange);
        }
    });
    return new Proxy(target, {
        get(target: any, p: string | number | '__isProxy', receiver: any): any {
            return standardGet(target, p);
        },
        set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
            if (typeof value === 'object') {
                target[p] = makeInternalProxy(value, onChange);
            }
            else {
                target[p] = value;
            }
            try {
                console.log(`__listeners on ${JSON.stringify(target)}: ${JSON.stringify(target[__listeners])}`);
                target[__listeners].forEach((l) => {
                    l(p)
                });
            } catch {}
            return true;
        },
        ownKeys(target: any): PropertyKey[] {
            console.log(Object.getOwnPropertyNames(target));
            return Object.getOwnPropertyNames(target).filter((a) => a !== __listeners);
        }
    })
}
export default function DataManager<T extends StructDef>(keys: T): Data<T> {
    const listeners: ListenerDict<T> = {};
    return new Proxy({} as any, {
        get(target: T & {__listeners?: ListenerDict<T>}, p: keyof T | 'subscribe', receiver: any): any {
            if (p === 'subscribe') {
                return (key: keyof T, listener: any) => {
                    if (typeof target.__listeners === 'undefined') {
                        target.__listeners = {};
                    }
                    let listeners = target.__listeners[key];
                    if (typeof listeners === 'undefined') {
                        target.__listeners[key] = [];
                        listeners =  target.__listeners[key];
                    }
                    // Listeners should narrow to non-undefined due to above if statement
                    listeners!.push(listener);
                }
            }
            return standardGet(target, p);
        },
        set(target: any, p: keyof T, value: any, receiver: any): boolean {
            target[p] = value;
            if (typeof value === 'object') {
                target[p] = makeInternalProxy(value, () => {
                    (((target.__listeners || {})[p] || []) as any).forEach((listener: any) => {
                        try {
                            listener(target[p]);
                        }
                        catch {}
                    });
                });
            }
            else {
                target[p] = value;
            }
            (((target.__listeners || {})[p] || []) as any).forEach((listener: any) => {
                try {
                    listener(target[p]);
                }
                catch {}
            });
            return true;
        },
        ownKeys(target: any): PropertyKey[] {
            console.log(Object.getOwnPropertyNames(target));
            return Object.getOwnPropertyNames(target).filter((a) => a !== __listeners);
        }
    })
}