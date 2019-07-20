import Card from "../cards/Card";
import CardRegistry from "../cards/CardRegistry";
import createSupplyData from "../createSupplyData";

export default class Supply {
    data = createSupplyData();
    public getPile(identifier: string): Array<Card> | null {
        const pile = this.data.piles.find((a) => a.identifier === identifier);
        if (!pile) return null;
        return pile.pile;
    }
    constructor() {

    }
    setup(activeCards: string[], playerCount: number, game) {
        const cardDefs = CardRegistry.getInstance().allCards();
        const locations = CardRegistry.getInstance().allCardLocations();
        activeCards.forEach((card) => {
            this.data.piles.push(...cardDefs[card].createSupplyPiles(playerCount, game));
            this.data.locations[card] = locations[card];
        });
    }
    get pilesEmpty() {
        return this.data.piles.filter((a) => a.pile.length === 0).length;
    }
}