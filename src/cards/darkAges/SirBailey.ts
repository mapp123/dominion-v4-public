import Player from "../../server/Player";
import Knight from "./Knight.abstract";

export default class SirBailey extends Knight {
    static descriptionSize = 54;
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "sir bailey";
    cost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/Sir_BaileyArt.jpg";
    async beforeKnight(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
    }
}
