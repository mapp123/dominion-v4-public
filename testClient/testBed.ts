import {TestGame, TestPlayer} from "../test/testBed";
import {Decision, DecisionResponseType} from "../src/server/Decision";
import Player from "../src/server/Player";
import {Server} from "socket.io";
import {EventEmitter} from "events";
export default class ClientTestPlayer extends TestPlayer {
    rejectDecisionPromise: ((err: Error) => any) | null = null;
    async makeDecision<T extends Decision>(decision: T): Promise<DecisionResponseType[T["decision"]]> {
        const returnPromise = Player.prototype.makeDecision.apply(this, [decision]);
        return new Promise<any>((f, r) => {
            let resolved = false;
            returnPromise.then((item) => {
                if(!resolved) {
                    resolved = true;
                    f(item);
                }
            });
            this.rejectDecisionPromise = (err) => {
                resolved = true;
                r(err);
            }
        });
    }
    async getDecisionResponse(decision: Decision) {
        return await super.makeDecision(decision);
    }
}
export class ClientTestGame extends TestGame {
    eventEmitter: EventEmitter | null = null;
    start(): Promise<void> {
        this.eventEmitter?.emit('playerCount', this.players.length);
        return super.start();
    }
}
export function setupClientTestBed(server: Server): EventEmitter {
    const e = new EventEmitter();
    globalThis.testGameCreator = () => {
        const g = new ClientTestGame(server);
        g.eventEmitter = e;
        e.emit('newGame', g);
        return g;
    };
    globalThis.testPlayerPrototype = ClientTestPlayer;
    return e;
}