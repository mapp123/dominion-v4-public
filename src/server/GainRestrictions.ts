import Game from "./Game";
import Card from "../cards/Card";

export type GainRestrictionsJSON = {
    allowedCards: string[];
}
export class GainRestrictions {
    maxCoinCost = Infinity;
    exactCoinCost: number | null = null;
    inSupply = true;
    allowedCards: string[] | null = null;
    mustHaveTypes: string[] = [];
    banned: string[] = [];
    isCard = true;
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
            && game.getCostOfCard(card).coin <= this.maxCoinCost
            && ((this.exactCoinCost == null) || game.getCostOfCard(card).coin === this.exactCoinCost)
            && this.mustHaveTypes.reduce((last, type) => last && game.getTypesOfCard(card).includes(type as any), true)
            && !this.banned.includes(card)
            && (!this.isCard || game.getCard(card).isCard);
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
        };
    }
    build(game: Game) {
        return this.toJSON(game);
    }
    setMaxCoinCost(coinCost: number) {
        this.maxCoinCost = coinCost;
        return this;
    }
    setExactCoinCost(coinCost: number) {
        this.exactCoinCost = coinCost;
        return this;
    }
    setMustIncludeType(type: string) {
        this.mustHaveTypes.push(type);
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    setInSupply(inSupply: boolean) {
        this.inSupply = inSupply;
        return this;
    }
    addBannedCard(card: string) {
        this.banned.push(card);
        return this;
    }
    setIsCard(isCard: boolean) {
        this.isCard = isCard;
        return this;
    }
}