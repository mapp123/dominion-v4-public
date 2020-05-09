import Card from "../Card";
import type Player from "../../server/Player";

export default class Laboratory extends Card {
    intrinsicTypes = ["action"] as const;
    name = "laboratory";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "+1 Action";
    supplyCount = 10;
    cardArt = "/img/card-img/LaboratoryArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(2, true);
        player.data.actions++;
    }
}
