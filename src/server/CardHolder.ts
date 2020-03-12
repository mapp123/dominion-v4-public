import Card from "../cards/Card";

export default class CardHolder {
    private cards: Card[] = [];
    public get isEmpty() {
        return this.cards.length === 0;
    }
    public getCards() {
        return this.cards;
    }
    public addCard(card: Card) {
        this.cards.push(card);
    }
    public removeCard(card: Card) {
        if (this.cards.includes(card)) {
            return this.cards.splice(this.cards.indexOf(card), 1)[0];
        }
        return null;
    }
    public popCard() {
        return this.cards.pop() || null;
    }
}