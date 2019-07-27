import shuffle from "./util/shuffle";
import {CardInstance} from "./CardInstance";
import Card from "../cards/Card";

export default class Deck {
    cards: Card[] = [];
    discard: Card[] = [];

    get deckAndDiscard() {
        return [...this.cards, ...this.discard]
    }

    setCards(cards: Card[]) {
        this.cards = cards;
    }

    pop() {
        if (this.cards.length === 0) {
            this.shuffle();
        }
        return this.cards.shift()
    }
    peek(): Card | undefined {
        if (this.cards.length === 0) {
            this.shuffle();
        }
        return this.cards[0];
    }

    getBottomCard() {
        if (this.cards.length === 0) {
            this.shuffle();
        }
        return this.cards.pop();
    }

    shuffle() {
        this.cards = [...this.cards, ...shuffle(this.discard)];
        this.discard = [];
    }

    discardCard(card: Card) {
        if (Array.isArray(card)) {
            this.discard = [...this.discard, ...card]
        } else {
            this.discard.push(card)
        }
    }

    draw() {
        if (this.cards.length === 0) {
            this.shuffle();
        }
        return this.cards.shift()
    }
}