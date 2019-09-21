import Card from "../Card";
import Player from "../../server/Player";

export default class Village extends Card {
    types = ["action"] as const;
    name = "village";
    cost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+2 Actions";
    supplyCount = 10;
    cardArt = "/img/card-img/VillageArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions += 2;
    }
}