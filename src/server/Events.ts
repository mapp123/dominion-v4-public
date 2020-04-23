import type Card from "../cards/Card";
import type Player from "./Player";
import type Deck from "./Deck";
import type Tracker from "./Tracker";

type BaseEvents = {[event: string]: any[]};
type Cbs<A extends BaseEvents> = {
    [P in keyof A]: Array<(...args: A[P]) => boolean | Promise<boolean>> | undefined;
}
export class Events<T extends BaseEvents> {
    private cbs: Cbs<T> = {} as any;
    async emit<P extends keyof T>(event: P, ...args: T[P]) {
        const arr = this.cbs[event];
        if (typeof arr === 'undefined') {
            return;
        }
        // TODO: Remove slice when microsoft/TypeScript#32502 gets fixed
        for (const cb of arr.slice()) {
            if (!await cb(...args)) {
                arr.splice(arr.indexOf(cb), 1);
            }
        }
    }
    on<P extends keyof T>(event: P, cb: (...args: T[P]) => boolean | Promise<boolean>): (...args: T[P]) => boolean | Promise<boolean> {
        if (!this.cbs[event]) {
            this.cbs[event] = [];
        }
        this.cbs[event]!.push(cb);
        return cb;
    }
    off<P extends keyof T>(event: P, cb: (...args: T[P]) => boolean | Promise<boolean>): (...args: T[P]) => boolean | Promise<boolean> {
        if (!this.cbs[event]) {
            return cb;
        }
        const index = this.cbs[event]!.indexOf(cb);
        if (index > -1) {
            this.cbs[event]!.splice(index, 1);
        }
        return cb;
    }
}
type PlayerEvent = {
    turnStart: [];
    turnEnd: [];
    buy: [string];
    gain: [Tracker<Card>];
    trash: [Tracker<Card>];
    cleanupStart: [];
    buyStart: [];
    handDraw: [];
    decision: [];
    treasureCardPlayed: [Player, Card];
    noActionImpl: [Card, Player[]];
    noTreasureImpl: [Card];
    shuffle: [Deck];
    willPlayAction: [Card];
    actionCardPlayed: [Card, Tracker<Card>];
}
export class PlayerEvents extends Events<PlayerEvent> {}
type GameEvent = {
    scoreStart: [];
    gameEnd: [];
    gain: [Player, Tracker<Card>];
    trash: [Player, Tracker<Card>];
    buy: [Player, string];
    buyStart: [];
    actionCardPlayed: [Player, Card];
    turnStart: [Player];
    turnEnd: [Player];
};
export class GameEvents extends Events<GameEvent> {}