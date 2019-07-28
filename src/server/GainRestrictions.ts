import Game from "./Game";
import Card from "../cards/Card";
import CardRegistry from "../cards/CardRegistry";

interface CostRestriction {
    type: 'cost';
    value: {
        coin: number
    }
}
interface SupplyRestriction {
    type: 'inSupply';
    value: boolean;
}
type Restriction = CostRestriction | SupplyRestriction;
export type GainRestrictionsJSON = {
    allowedCards: string[];
}
export class GainRestrictions {
    maxCoinCost: number = Infinity;
    inSupply = true;
    allowedCards: string[] | null = null;
    mustHaveTypes: string[] = [];
    private constructor() {

    }
    static fromJSON(json: GainRestrictionsJSON) {
        const i = new this();
        i.allowedCards = json.allowedCards;
        return i;
    }
    static instance() {
        return new this();
    }
    validateCard(card: string) {
        if (this.allowedCards == null) {
            throw new Error("Tried to validate card without prior build()");
        }
        return this.allowedCards.includes(card);
    }
    private isCardAllowed(game: Game, card: string) {
        return (!this.inSupply || game.nameAvailableInSupply(card))
            && game.getCostOfCard(card).coin <= this.maxCoinCost && this.mustHaveTypes.reduce((last, type) => last && CardRegistry.getInstance().getCard(card).types.includes(type as any), true);
    }
    toJSON(game: Game): GainRestrictionsJSON {
        this.allowedCards = [];
        game.supply.data.piles.forEach((pile) => {
            let card: Card;
            if (pile.pile.length === 0 && this.inSupply) {
                return;
            }
            else if (pile.pile.length === 0) {
                card = pile.identity;
            }
            else {
                card = pile.pile[pile.pile.length - 1];
            }
            if (this.isCardAllowed(game, card.name)) {
                this.allowedCards!.push(card.name);
            }
        });
        return {
            allowedCards: this.allowedCards
        }
    }
    build(game: Game) {
        return this.toJSON(game);
    }
    setMaxCoinCost(coinCost: number) {
        this.maxCoinCost = coinCost;
        return this;
    }
    setMustIncludeType(type: string) {
        this.mustHaveTypes.push(type);
        return this;
    }
    setInSupply(inSupply: boolean) {
        this.inSupply = inSupply;
    }
}