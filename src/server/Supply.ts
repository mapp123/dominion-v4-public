import type Card from "../cards/Card";
import CardRegistry from "../cards/CardRegistry";
import createSupplyData from "../createSupplyData";
import cardSorter from "./cardSorter";
import type Game from "./Game";

export const UNCOUNTED_EMPTY_SUPPLY_PILE = [];

export default class Supply {
    data = createSupplyData();
    private unsyncedData: {[key: string]: any} = {};
    public getPile(identifier: string): Card[] | null {
        const pile = this.data.piles.find((a) => a.identifier === identifier);
        if (!pile) return null;
        return pile.pile;
    }
    public getMyUnsyncedCardData(card: Card | string): any {
        return this.unsyncedData[typeof card === 'string' ? card : card.name];
    }
    public setMyUnsyncedCardData(card: Card | string, data: any) {
        this.unsyncedData[typeof card === 'string' ? card : card.name] = data;
    }
    constructor() {

    }
    setup(activeCards: string[], playerCount: number, game: Game) {
        const cardDefs = CardRegistry.getInstance().allCards();
        const locations = CardRegistry.getInstance().allCardLocations();
        this.data.activatedCards = activeCards;
        activeCards.sort((a, b) => cardSorter(cardDefs[a], cardDefs[b])).forEach((card) => {
            this.data.piles.push(...cardDefs[card].createSupplyPiles(playerCount, game) as any);
            this.data.locations[card] = locations[card];
        });
        activeCards.forEach((card) => {
            this.data.globalCardData[card] = {};
            cardDefs[card].setup(this.data.globalCardData[card], game);
            cardDefs[card].registerInterrupts(game);
        });
    }
    get gainsToEndGame() {
        const threePiles = this.data.piles
            .filter((a) => (a.pile as any).__underlyingValue !== UNCOUNTED_EMPTY_SUPPLY_PILE)
            .filter((a) => a.countForEmpty !== false)
            .sort((a, b) => a.pile.length - b.pile.length)
            .slice(0, 3)
            .reduce((sum, next) => sum + next.pile.length, 0);
        const provinces = this.getPile('province')!.length;
        return Math.min(provinces, threePiles);
    }
    get pilesEmpty() {
        return this.data.piles
            .filter((a) => a.pile.length === 0 && (a.pile as any).__underlyingValue !== UNCOUNTED_EMPTY_SUPPLY_PILE)
            .filter((a) => a.countForEmpty !== false).length;
    }
}