import Game from "../src/server/Game";
import Player from "../src/server/Player";
import Card from "../src/cards/Card";
import CardRegistry from "../src/cards/CardRegistry";
import {Decision, DecisionResponseType} from "../src/server/Decision";
import {Texts} from "../src/server/Texts";
import * as ts from "typescript/lib/tsserverlibrary";
import convertFormatOptions = ts.server.convertFormatOptions;
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
    get discardPile() {
        return this.deck.discard.map((a) => a.name);
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
    testReveal(card: string, shouldReveal = true) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'confirm' && decision.helperText === Texts.doYouWantToReveal('moat'),
            response: () => shouldReveal
        });
    }
    testGain(forCard: string, gainCard: string) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'gain' && decision.helperText === Texts.chooseCardToGainFor(forCard),
            response: () => {
                const pile = this.game.supply.data.piles.find((a) => a.pile[a.pile.length - 1].name === gainCard);
                if (!pile) {
                    throw new Error("Asked to find non-existent pile")
                }
                return pile.pile[pile.pile.length - 1];
            }
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
class DrawAttack extends Card {
    randomizable = false;
    cardText = "";
    cost = {
        coin: 0
    };
    types = ["action", "attack"] as const;
    name = "attack";
    supplyCount = 10;
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.attackOthersInOrder(exemptPlayers, async (player) => {
            player.draw(1);
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
    injectTestAttack() {
        CardRegistry.getInstance().injectCard(DrawAttack as any);
    }

    determineTurnOrder() {
        // Retain default ordering
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
            if (cardName === "attack") {
                game.injectTestAttack();
            }
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