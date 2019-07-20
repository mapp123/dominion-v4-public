import Game from "../src/server/Game";
import Player from "../src/server/Player";
import Card from "../src/cards/Card";
import CardRegistry from "../src/cards/CardRegistry";
import {Decision, DecisionResponseType} from "../src/server/Decision";
import {Texts} from "../src/server/Texts";
function makeFakeIo(onLog?: (msg: string) => any) {
    return {
        on: (msg, cb) => {

        },
        emit: (msg, ...args) => {
            if (msg === 'log' && onLog) {
                onLog(args[0]);
            }
        },
        of: () => makeFakeIo(onLog)
    }
}
type DecisionMatcher = (decision: Decision) => boolean;
type DecisionResponse = {
    matcher: DecisionMatcher;
    response: (decision) => DecisionResponseType[Decision["decision"]];
}
let testPlayerIndex = 1;
class TestPlayer extends Player {
    decisionResponses: Array<DecisionResponse> = [];
    get hand() {
        return this.data.hand.map((a) => a.name);
    }
    async makeDecision<T extends Decision>(decision: T): Promise<DecisionResponseType[T["decision"]]> {
        if (decision.decision === 'chooseUsername') {
            return `Test Player ${testPlayerIndex++}` as any;
        }
        const rIndex = this.decisionResponses.findIndex((a) => a.matcher(decision));
        if (rIndex !== -1) {
            const response = this.decisionResponses.splice(rIndex, 1)[0];
            return response.response(decision) as any;
        }
        // @ts-ignore
        this.game.doneFn(new Error(`Failed to find a response for ${JSON.stringify(decision)}`));
        throw new Error("Failed to find a response.");
    }
    testPlayAction(actionName: string) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'chooseCard' && decision.helperText === Texts.chooseActionToPlay,
            response: () => this.data.hand.find((a) => a.name === actionName) as any
        })
    }
    testChooseCard(text: string, card: string) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'chooseCard' && decision.helperText === text,
            response: (decision) => decision.source.find((a) => a.name === card) as any
        });
    }
    onBuyPhaseStart(cb: () => any) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'chooseCardOrBuy' || decision.decision === 'buy',
            response: () => {
                try {
                    cb();
                }
                catch (e) {
                    // @ts-ignore
                    this.game.doneFn(e);
                }
                return {decisionType: 'buy', choice: {name: 'End Turn', id: ''}};
            }
        });
    }
}
class TestGame extends Game {
    done = false;
    private doneFn: (error?) => any = null as any;
    setDone(done: (error?) => any) {
        this.doneFn = (error?) => {
            this.done = true;
            done(error);
        };
        return this.doneFn;
    }
    gameEnded(): boolean {
        return this.done;
    }
}
export default function makeTestGame({
    players = 1,
    decks = [['copper']],
    d = (error?) => {}
                                     }): [TestGame, TestPlayer[], () => any] {
    const game = new TestGame(makeFakeIo((msg) => {
        console.log(msg)
    }) as any);
    game.setCards(null as any, decks.reduce((full, deck) => [...full, ...deck], []).filter((a, i, arr) => arr.indexOf(a) === i));
    for (let i = 0; i < players; i++) {
        const player = new TestPlayer(game);
        let deck = [] as Card[];
        for (const cardName of decks[i]) {
            deck.push(
                new (CardRegistry.getInstance().getCard(cardName))(game)
            )
        }
        player.deck.setCards(deck);
        player.data.hand = [];
        player.draw(5);
        game.players.push(player);
    }
    const done = game.setDone(d);
    return [game, game.players as TestPlayer[], done];
}