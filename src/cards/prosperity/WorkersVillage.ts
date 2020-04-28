import Card from "../Card";
import type Player from "../../server/Player";

export default class WorkersVillage extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action"] as const;
    name = "worker's village";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+2 Actions\n" +
        "+1 Buy";
    supplyCount = 10;
    cardArt = "/img/card-img/Workers_VillageArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 2;
        player.data.buys += 1;
    }
}
