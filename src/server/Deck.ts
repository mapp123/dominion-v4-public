import shuffle from "./util/shuffle";
import Card from "../cards/Card";

export default class Deck {
    cards: Card[] = [];
    discard: Card[] = [];

    get deckAndDiscard() {
        return [...this.cards, ...this.discard];
    }

    setCards(cards: Card[]) {
        this.cards = cards;
    }

    async pop() {
        if (this.cards.length === 0) {
            await this.shuffle();
        }
        return this.cards.shift();
    }
    async peek(): Promise<Card | undefined> {
        if (this.cards.length === 0) {
            await this.shuffle();
        }
        return this.cards[0];
    }

    async shuffle() {
        this.cards = [...this.cards, ...shuffle(this.discard)];
        this.discard = [];
    }

    // This is actually used, just suppressed
    // noinspection JSUnusedLocalSymbols
    private _fastShuffle() {
        this.cards = [...this.cards, ...shuffle(this.discard)];
        this.discard = [];
    }

    discardCard(card: Card) {
        if (Array.isArray(card)) {
            this.discard = [...this.discard, ...card];
        } else {
            this.discard.push(card);
        }
    }

    /*draw() {
        if (this.cards.length === 0) {
            this.shuffle();
        }
        return this.cards.shift();
    }*/
}