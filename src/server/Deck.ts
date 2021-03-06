import shuffle from "./util/shuffle";
import type Card from "../cards/Card";
import type Player from "./Player";
import {Texts} from "./Texts";

export default class Deck {
    _cards: Card[] = [];
    discard: Card[] = [];
    player: Player;
    shouldShuffle = true;
    constructor(player: Player) {
        this.player = player;
    }
    get cards() {
        return this._cards;
    }
    set cards(val) {
        this._cards = val;
    }

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
        this.discard.forEach((card) => {
            card.loseTrack();
        });
        this.cards = [...this.cards, ...(this.shouldShuffle ? shuffle(this.discard) : this.discard)];
        this.discard = [];
        await this.player.events.emit('shuffle', this);
        await this.player.effects.doEffect('shuffle', Texts.chooseAnXEffectToRunNext('on shuffle'), [], this);
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