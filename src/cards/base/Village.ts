import Card from "../Card";
import type Player from "../../server/Player";

export default class Village extends Card {
    intrinsicTypes = ["action"] as const;
    name = "village";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+2 Actions";
    supplyCount = 10;
    cardArt = "/img/card-img/VillageArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions += 2;
    }
}