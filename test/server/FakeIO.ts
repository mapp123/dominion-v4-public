import {EventEmitter} from "events";

class FakeSocket extends EventEmitter {
    async waitFor(event: string, timeout = 1000) {
        const error = new Error(`Event ${event} timed out.`);
        let bigF: null | (() => any) = null;
        const oncePromise = new Promise((f) => {
            this.once(event, (...args) => args.length === 1 ? f(args[0]) : f(args));
            bigF = f;
        });
        const timeoutPromise = new Promise((f) => {
            setTimeout(() => {
                if (bigF) {
                    this.removeListener(event, bigF);
                }
                f(error);
            }, timeout);
        });
        const result = await Promise.race([
            oncePromise,
            timeoutPromise
        ]);
        return result as any;
    }
}

export default class FakeIO extends EventEmitter {
    static currentFake: FakeIO;
    static of(namespace: string) {
        this.currentFake = new this();
        return this.currentFake;
    }
    constructor() {
        super();
    }
    createFakeSocket() {
        return new FakeSocket();
    }
    connectFakeSocket(fakeSocket: EventEmitter) {
        this.emit('connection', fakeSocket);
    }
}