import Player from "../../server/Player";
import Knight from "./Knight.abstract";

export default class DameMolly extends Knight {
    static descriptionSize = 54;
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "dame molly";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Actions\n" +
        "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/Dame_MollyArt.jpg";
    async beforeKnight(player: Player): Promise<void> {
        player.data.actions += 2;
    }
}
