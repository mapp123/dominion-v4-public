import nlp = require('compromise');
import Card from "./cards/Card";
export default class Util {
    static checkTrashSanity(selected: Card, choices: Card[]) {
        return !(selected.cost.coin > 2 && choices.find((a) => selected.cost.coin > a.cost.coin) != null);
    }
    static formatCardList(cards: string[]): string {
        let formattedCards = cards.map((a, i) => {
            if (cards.indexOf(a) !== i) {
                return undefined;
            }
            let count = cards.filter((b) => a === b).length;
            if (count === 1) {
                return this.article(a) + ' ' + a;
            }
            return this.numeral(count) + ' ' + this.plural(a);
        }).filter((a) => a != null) as string[];
        if (formattedCards.length === 0) {
            return '';
        }
        if (formattedCards.length === 1) {
            return formattedCards[0];
        }
        if (formattedCards.length === 2) {
            return `${formattedCards[0]} and ${formattedCards[1]}`;
        }
        return formattedCards.slice(0, -1).join(', ') + ', and ' + formattedCards.slice(-1)[0];
    }
    private static articleCache: {[word: string]: string | undefined} = {};
    static article(card: string): string {
        if (!this.articleCache[card]) {
            this.articleCache[card] = nlp('the nice ' + card).tag('Noun').nouns().list[0].article().trim();
        }
        return this.articleCache[card]!;
    }
    private static pluralCache: {[word: string]: string | undefined} = {};
    static plural(card: string): string {
        if (!this.pluralCache[card]) {
            this.pluralCache[card] = nlp(card).tag('Noun').nouns().list[0].toPlural().out('text').trim();
        }
        return this.pluralCache[card]!;
    }
    private static numberCache: {[number: number]: string | undefined} = {};
    static numeral(number: number): string {
        if (!this.numberCache[number]) {
            this.numberCache[number] = nlp(number + '').values().list[0].toText().out('text').trim();
        }
        return this.numberCache[number]!;
    }
}