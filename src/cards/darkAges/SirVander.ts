import Player from "../../server/Player";
import Knight from "./Knight.abstract";

export default class SirVander extends Knight {
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "sir vander";
    cost = {
        coin: 5
    };
    cardText = "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.\n" +
        "---\n" +
        "When you trash this, gain a Gold.";
    cardArt = "/img/card-img/Sir_VanderArt.jpg";
    async beforeKnight(): Promise<void> {

    }
    async onTrashSelf(player: Player) {
        await player.gain('gold');
    }
}
