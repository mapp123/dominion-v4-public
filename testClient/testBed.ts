import {TestGame, TestPlayer} from "../test/testBed";
import {Decision, DecisionResponseType} from "../src/server/Decision";
import Player from "../src/server/Player";
import {Server} from "socket.io";
import {EventEmitter} from "events";
import {Interrupt} from "./Interrupt";

function either<K, T>(one: T, two: K): T | K {
    return one;
}
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
    async call(cardName: string, decisions: () => any) {
        const response = {
            matcher: (decision) => {
                if (this.decisionResponses[this.decisionResponses.indexOf(response) + 1].matcher(decision)) {
                    return true;
                }
                if (this.decisionResponses.slice(this.decisionResponses.indexOf(response) + 1).every((a) => !a.matcher(decision)) && this.optionalDecisionResponses[0]?.matcher(decision)) {
                    return true;
                }
                return false;
            },
            response: async (d) => {
                decisions();
                return new Interrupt('reserve', {
                    cardId: this.data.tavernMat.find((a) => a.card.name === cardName)!.card.id
                }) as any
            }
        }
        this.decisionResponses.push(response);
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