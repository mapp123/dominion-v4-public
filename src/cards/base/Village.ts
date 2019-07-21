import Card from "../Card";
import Player from "../../server/Player";

export default class Cellar extends Card {
    types = ["action"] as const;
    name = "village";
    cost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+2 Actions";
    supplyCount = 10;
    async onAction(player: Player): Promise<void> {
        player.draw(1);
        player.data.actions += 2;
    }
}