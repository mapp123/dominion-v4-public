import Card from "../cards/Card";
import Player from "./Player";

type BaseEvents = {[event: string]: any[]};
type Cbs<A extends BaseEvents> = {
    [P in keyof A]: Array<(...args: A[P]) => boolean | Promise<boolean>> | undefined;
}
export class Events<T extends BaseEvents> {
    private cbs: Cbs<T> = {} as any;
    async emit<P extends keyof T>(event: P, ...args: T[P]) {
        let arr = this.cbs[event];
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
    gain: [Card, {hasTrack: boolean}, () => any];
    trash: [Card, {hasTrack: boolean}, () => any];
    cleanupStart: [];
    buyStart: [];
    handDraw: [];
    treasureCardPlayed: [Player, Card];
}
export class PlayerEvents extends Events<PlayerEvent> {}
type GameEvent = {
    gameEnd: [];
    gain: [Player, Card, {hasTrack: boolean}, () => any];
    buy: [Player, string];
    actionCardPlayed: [Player, Card];
    turnStart: [Player];
    turnEnd: [Player];
};
export class GameEvents extends Events<GameEvent> {}