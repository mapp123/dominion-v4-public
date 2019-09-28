import Card from "../Card";
import Player from "../../server/Player";

export default class TardisVillage extends Card {
    intrinsicTypes = ["action"] as const;
    name = "tardis village";
    cost = {
        coin: 4
    };
    cardText = "+2 Actions\n" +
        "Discard everything in play.";
    supplyCount = 10;
    cardArt = "/img/card-img/Mountain_VillageArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 2;
        await player.discard(player.data.playArea.slice(0), true);
        player.data.playArea = [];
    }
}
