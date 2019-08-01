import Card from "../cards/Card";
import CardRegistry from "../cards/CardRegistry";
import createSupplyData from "../createSupplyData";
import cardSorter from "./cardSorter";
import Game from "./Game";

export default class Supply {
    data = createSupplyData();
    public getPile(identifier: string): Card[] | null {
        const pile = this.data.piles.find((a) => a.identifier === identifier);
        if (!pile) return null;
        return pile.pile;
    }
    constructor() {

    }
    setup(activeCards: string[], playerCount: number, game: Game) {
        const cardDefs = CardRegistry.getInstance().allCards();
        const locations = CardRegistry.getInstance().allCardLocations();
        this.data.activatedCards = activeCards;
        activeCards.sort((a, b) => cardSorter(cardDefs[a], cardDefs[b])).forEach((card) => {
            this.data.piles.push(...cardDefs[card].createSupplyPiles(playerCount, game));
            this.data.locations[card] = locations[card];
        });
        activeCards.forEach((card) => {
            this.data.globalCardData[card] = {};
            cardDefs[card].setup(this.data.globalCardData[card], game);
        });
    }
    get pilesEmpty() {
        return this.data.piles.filter((a) => a.pile.length === 0).length;
    }
}