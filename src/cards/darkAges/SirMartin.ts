import Player from "../../server/Player";
import Knight from "./Knight.abstract";

export default class SirMartin extends Knight {
    static descriptionSize = 56;
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "sir martin";
    cost = {
        coin: 4
    };
    cardText = "+2 Buys\n" +
        "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/Sir_MartinArt.jpg";
    async beforeKnight(player: Player): Promise<void> {
        player.data.buys += 2;
    }
}
