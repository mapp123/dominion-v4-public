import Card from "../Card";
import Game from "../../server/Game";
import shuffle from "../../server/util/shuffle";

export const knightNames = [
    'dame anna',
    'dame josephine',
    'dame molly',
    'dame natalie',
    'dame sylvia',
    'sir bailey',
    'sir destry',
    'sir martin',
    'sir michael',
    'sir vander'
];

export default class Knights extends Card {
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "knights";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/KnightsArt.jpg";
    supplyCount = 0;
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean; inSupply?: boolean}> {
        const pile: Card[] = knightNames.map((a) => new (game.getCard(a))(game));
        shuffle(pile);
        return [{
            pile,
            identifier: "knights",
            identity: new this(game),
            displayCount: true,
            inSupply: true
        }];
    }
    public static onChosen() {
        return knightNames;
    }
}
