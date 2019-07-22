import Game from "../src/server/Game";
import Player from "../src/server/Player";
import Card from "../src/cards/Card";
import CardRegistry from "../src/cards/CardRegistry";
import {Decision, DecisionResponseType} from "../src/server/Decision";
import {Texts} from "../src/server/Texts";
function makeFakeIo(onLog?: (msg: string) => any) {
    return {
        on: () => {},
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
            const r = response.response(decision) as any;
            return r;
        }
        // @ts-ignore
        this.game.doneFn(new Error(`Failed to find a response for ${JSON.stringify(decision)}`));
        throw new Error("Failed to find a response.");
    }
    testHookNextDecision(cb: () => any) {
        const response = {
            matcher: (decision) => this.decisionResponses[this.decisionResponses.indexOf(response) + 1].matcher(decision),
            response: (decision) => {
                try {
                    cb();
                }
                catch (e) {
                    // @ts-ignore
                    this.game.doneFn(e);
                }
                const r = this.decisionResponses.splice(this.decisionResponses.indexOf(response) + 1, 1)[0];
                return r.response(decision);
            }
        };
        this.decisionResponses.push(response);
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
    throneRoomTarget(card: string) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'chooseCard' && decision.helperText === Texts.chooseCardToPlayTwice,
            response: (decision) => decision.source.find((a) => a.name === card)
        });
    }
    testReveal(card: string, shouldReveal = true) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'confirm' && decision.helperText === Texts.doYouWantToReveal('moat'),
            response: () => shouldReveal
        });
    }
    testConfirm(text: string, confirm: boolean) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'confirm' && decision.helperText === text,
            response: () => confirm
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
    testPlayTreasure(card: string) {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'chooseCardOrBuy',
            response: (decision) => ({responseType: 'playCard', choice: decision.source.find((a) => a.name === card)})
        });
    }
    endTurn() {
        this.decisionResponses.push({
            matcher: (decision) => decision.decision === 'chooseCardOrBuy' || decision.decision === 'buy',
            response: () => ({responseType: 'playCard', choice: {name: 'End Turn', id: ''}})
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
                return {responseType: 'playCard', choice: {name: 'End Turn', id: ''}};
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
    cardArt = "";
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
            if ((this.players as TestPlayer[]).filter((a) => a.decisionResponses.length).length) {
                done(new Error("Player had decisions left when game ended"));
            }
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
    onAccountabilityFailure(missingIds: string[], extraIds: string[]) {
        this.doneFn(new Error(`The following ids were missing: ${missingIds.join(", ")}\nThe following ids were created or duplicated: ${extraIds.join(", ")}`));
    }
}
export default function makeTestGame({
    players = 1,
    decks = [[]] as string[][],
    discards = [[]] as string[][],
    d = () => {}
                                     }): [TestGame, TestPlayer[], () => any] {
    const game = new TestGame(makeFakeIo((msg) => {
        console.log(msg)
    }) as any);
    game.setCards(null as any, [
        ...decks.reduce((full, deck) => [...full, ...deck], []),
        ...discards.reduce((full, discard) => [...full, ...discard], [])
    ].filter((a, i, arr) => arr.indexOf(a) === i));
    for (let i = 0; i < players; i++) {
        const player = new TestPlayer(game);
        let deck = [] as Card[];
        for (const cardName of (decks[i] || [])) {
            if (cardName === "attack") {
                game.injectTestAttack();
            }
            deck.push(
                new (CardRegistry.getInstance().getCard(cardName))(game)
            );
        }
        player.deck.setCards(deck);
        let discard = [] as Card[];
        for (const cardName of (discards[i] || [])) {
            if (cardName === "attack") {
                game.injectTestAttack();
            }
            discard.push(
                new (CardRegistry.getInstance().getCard(cardName))(game)
            );
        }
        player.deck.discard = discard;
        player.data.hand = [];
        player.draw(5);
        game.players.push(player);
    }
    const done = game.setDone(d);
    return [game, game.players as TestPlayer[], done];
}