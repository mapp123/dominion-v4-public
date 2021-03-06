import type Player from "../../server/Player";
import Knight from "./Knight.abstract";

export default class SirDestry extends Knight {
    static descriptionSize = 56;
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "sir destry";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/800px-Sir_DestryArt.jpg";
    async beforeKnight(player: Player): Promise<void> {
        await player.draw(2, true);
    }
}
