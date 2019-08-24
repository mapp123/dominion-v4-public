import Player from "./Player";
import {Decision, DecisionDefaults, DecisionResponseType} from "./Decision";
import {Texts} from "./Texts";
import Card from "../cards/Card";

type PossibleAsync<T> = T | Promise<T>;

function assertNever(a: never) {
    throw a;
}

const SENTINEL = "SENTINEL";

function decisionMatcher<T extends string[]>(helperText: string, textFn: (...args: T) => string): T | null {
    const parts = textFn(...(new Array(textFn.length).fill(SENTINEL) as any)).split(SENTINEL);
    let subs = [] as string[];
    let currentIndex = 0;
    let lastMatchedIndex = 0;
    let partIndex = 0;
    let replacement = "";
    top: while (currentIndex < helperText.length) {
        while (helperText.slice(lastMatchedIndex, currentIndex + 1) === parts[partIndex].slice(0, (currentIndex - lastMatchedIndex) + 1)) {
            currentIndex++;
            if (parts[partIndex].length === (currentIndex - lastMatchedIndex)) {
                // Part matched, move on
                partIndex++;
                lastMatchedIndex = currentIndex;
                subs.push(replacement);
                replacement = "";
                continue top;
            }
        }
        // Part didn't match, add current index to replacement and move on
        replacement += helperText.slice(lastMatchedIndex++, ++currentIndex);
    }
    subs.push(replacement);
    if (partIndex !== parts.length) {
        // We didn't get through all the parts, this isn't a matching message
        return null;
    }
    if (subs[0] === "") {
        subs = subs.slice(1);
    }
    return subs as any;
}
export default abstract class AIPlayer extends Player {
    private hasPlayedAllTreasures = false;
    private choiceLookup = {
        [Texts.trashIt]: this.trashPriority,
        [Texts.discardIt]: this.discardPriority
    };
    // Least to most destructive
    protected destructiveness = [
        Texts.keepIt,
        Texts.discardIt,
        Texts.putItOnYourDeck,
        Texts.trashIt
    ];
    private async chooseOptionFromPriorities(card: string, choices: string[]): Promise<string> {
        for (let choice of choices) {
            if (this.choiceLookup[choice]) {
                const priority = await this.choiceLookup[choice].call(this);
                let nullIndex = priority.indexOf(null);
                if (nullIndex === -1) {
                    nullIndex = priority.length;
                }
                if (priority.includes(card) && priority.indexOf(card) < nullIndex) {
                    return choice;
                }
            }
        }
        return choices.sort((a, b) => this.destructiveness.indexOf(a) - this.destructiveness.indexOf(b))[0];
    }
    private chooseCardFromPriority(priority: Array<string | null>, source: Card[]): Card {
        const choice = priority.map((a) => {
            if (a == null) {
                return source.find((a) => a.name === 'No Card');
            }
            return source.find((b) => b.name === a);
        }).find((a) => a !== undefined);
        if (choice != null) {
            return choice as any;
        }
        let noChoice = source.find((a) => a.name === 'No Card');
        if (noChoice) {
            return noChoice as any;
        }
        // We have to return something
        return source[0] as any;
    }
    protected decisionContext: Decision = null as any;
    async makeDecision<T extends Decision>(de: T): Promise<DecisionResponseType[T["decision"]]> {
        const decision: Decision = de;
        this.decisionContext = de;
        const d = DecisionDefaults[decision.decision](decision);
        if (d != null) {
            return d as any;
        }
        switch (decision.decision) {
            case "chooseCardOrBuy":
                if (!this.hasPlayedAllTreasures) {
                    const toPlay = await this.playNextTreasure(decision.source);
                    if (toPlay) {
                        return {
                            choice: decision.source.find((a) => a.name === toPlay),
                            responseType: 'playCard'
                        } as any;
                    }
                    else {
                        this.hasPlayedAllTreasures = true;
                    }
                }
            case "buy":
                const toBuy = (await this.gainPriority()).find((a) => a == null || decision.gainRestrictions.allowedCards.includes(a));
                if (toBuy) {
                    const pile = this.game.supply.data.piles.find((a) => a.pile.length && a.pile[a.pile.length - 1].name === toBuy)!.pile;
                    return {
                        choice: pile[pile.length - 1],
                        responseType: 'buy'
                    } as any;
                }
                else {
                    return {
                        responseType: 'buy',
                        choice: {
                            name: 'End Turn',
                            id: ''
                        }
                    } as any;
                }
            case "chooseOption":
                const chooseWhatToDoWithCard = decisionMatcher(decision.helperText, Texts.whatToDoWith);
                if (chooseWhatToDoWithCard) {
                    const [card] = chooseWhatToDoWithCard;
                    return {
                        choice: await this.chooseOptionFromPriorities(card, decision.options)
                    } as any;
                }
                const artifact = decisionMatcher(decision.helperText, () => Texts.whichArtifactWouldYouLike);
                if (artifact) {
                    return {
                        choice: decision.options[0]
                    } as any;
                }
                break;
            case "chooseCard":
                const keys = {
                    duplication: decisionMatcher(decision.helperText, Texts.chooseAToDuplicateWithB),
                    banCard: decisionMatcher(decision.helperText, Texts.chooseACardThatACannotBuyThisTurn),
                    chooseTreasureToTrash: decisionMatcher(decision.helperText, Texts.chooseATreasureToTrashFor),
                    chooseAToTrashForB: decisionMatcher(decision.helperText, Texts.chooseAnAToTrashForB),
                    victoryTopdeck: decisionMatcher(decision.helperText, Texts.chooseVictoryToTopDeckFor),
                    regularTopdeck: decisionMatcher(decision.helperText, () => Texts.chooseCardToPutOnDeck),
                    discardTopDeck: decisionMatcher(decision.helperText, Texts.chooseCardToMoveFromDiscardToDeck),
                    discardCard: decisionMatcher(decision.helperText, Texts.chooseCardToDiscardFor),
                    discardCardForBenefit: /Choose (.*?) cards? to discard. You'll get (.*?) if you do./.exec(decision.helperText),
                    trashCard: decisionMatcher(decision.helperText, Texts.chooseCardToTrashFor),
                    playAction: decisionMatcher(decision.helperText, () => Texts.chooseActionToPlay),
                    actionCardPlayTwice: decisionMatcher(decision.helperText, () => Texts.chooseCardToPlayTwice),
                    cardsToGainFromTrashed: decisionMatcher(decision.helperText, () => Texts.chooseCardToGainFromTrashed),
                    cardFromDiscard: decisionMatcher(decision.helperText, () => Texts.chooseCardToTakeFromDiscard),
                    forgeTrash: decisionMatcher(decision.helperText, Texts.chooseCardToTrashForge),
                    drawFromRevealed: decisionMatcher(decision.helperText, () => Texts.chooseCardToTakeFromRevealed)
                };
                if (keys.discardCard != null || keys.discardCardForBenefit) {
                    return this.chooseCardFromPriority(await this.discardPriority(), decision.source) as any;
                }
                if (keys.trashCard != null) {
                    return this.chooseCardFromPriority(await this.trashPriority(), decision.source) as any;
                }
                if (keys.discardTopDeck) {
                    return this.chooseCardFromPriority(await this.topDeckPriority(), decision.source) as any;
                }
                if (keys.victoryTopdeck) {
                    return this.chooseCardFromPriority((await this.topDeckPriority()).reverse(), decision.source) as any;
                }
                if (keys.regularTopdeck) {
                    return this.chooseCardFromPriority((await this.topDeckPriority()), decision.source) as any;
                }
                if (keys.chooseAToTrashForB) {
                    return this.chooseCardFromPriority((await this.trashPriority()).reverse(), decision.source) as any;
                }
                if (keys.chooseTreasureToTrash) {
                    return this.chooseCardFromPriority((await this.trashPriority()).reverse(), decision.source) as any;
                }
                if (keys.cardFromDiscard || keys.drawFromRevealed) {
                    return this.chooseCardFromPriority(await this.drawPriority(), decision.source) as any;
                }
                if (keys.forgeTrash) {
                    return this.chooseCardFromPriority(await this.trashPriority(), decision.source) as any;
                }
                if (keys.banCard) {
                    return {
                        name: 'gold',
                        id: ''
                    } as any;
                }
                if (keys.duplication || keys.cardsToGainFromTrashed) {
                    return this.chooseCardFromPriority(await this.gainPriority(), decision.source) as any;
                }
                if (keys.playAction || keys.actionCardPlayTwice) {
                    const actionToPlay = this.playNextAction(decision.source);
                    if (actionToPlay) {
                        const card = decision.source.find((a) => a.name === actionToPlay);
                        if (card) {
                            return {
                                id: card.id,
                                name: card.name
                            } as any;
                        }
                    }
                    return decision.source.find((a) => a.name === 'No Card') as any;
                }
                break;
            case "chooseUsername":
                return this.generateUsername() as any;
            case "confirm":
                // TODO: Maybe have this actually do something?
                return true as any;
            case "gain":
                const choice = this.chooseCardFromPriority(await this.gainPriority(), [
                    decision.optional ? {name: 'No Card', id: ''} as any : null,
                    ...decision.gainRestrictions.allowedCards.map((a) => ({name: a, id: ''}))
                ].filter((a) => a));
                if (choice.name === 'No Card') {
                    return {
                        id: '',
                        name: 'Gain Nothing'
                    } as any;
                }
                let pile = this.game.supply.data.piles.find((a) => {
                    return a.pile.length > 0 && a.pile[a.pile.length - 1].name === choice.name;
                });
                if (!pile) {
                    throw new Error("Missing supply pile");
                }
                return {
                    name: choice.name,
                    id: pile.pile[pile.pile.length - 1].id
                } as any;
            case "reorder":
                return {order: decision.cards} as any;
            default:
                assertNever(decision);
                break;
        }
        throw new Error(`Could not respond to decision: ${JSON.stringify(decision)}`);
    }
    abstract gainPriority(): PossibleAsync<Array<string | null>>;
    abstract trashPriority(): PossibleAsync<Array<string | null>>;
    abstract drawPriority(): PossibleAsync<Array<string | null>>;
    abstract discardPriority(): PossibleAsync<Array<string | null>>;
    abstract topDeckPriority(): PossibleAsync<Array<string | null>>;
    abstract playNextTreasure(source: Card[]): PossibleAsync<string | null>;
    abstract playNextAction(source: Card[]): PossibleAsync<string | null>;
    abstract generateUsername(): PossibleAsync<string>;
    protected getTotalMoney() {
        return this.allCards.reduce((sum, next) => {
            switch (next.name) {
                case 'copper':
                    return sum + 1;
                case 'silver':
                    return sum + 2;
                case 'gold':
                    return sum + 3;
                case 'platinum':
                    return sum + 5;
                default:
                    return sum;
            }
        }, 0);
    }
    protected gainsToEndGame() {
        const provinces = this.game.supply.data.piles.find((a) => a.identifier === 'province')!.pile.length;
        const rest = [...this.game.supply.data.piles].sort((a, b) => a.pile.length - b.pile.length).slice(0, 3).reduce((sum, next) => sum + next.pile.length, 0);
        return Math.min(provinces, rest);
    }
}