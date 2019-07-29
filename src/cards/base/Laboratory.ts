import Card from "../Card";
import Player from "../../server/Player";

export default class Laboratory extends Card {
    types = ["action"] as const;
    name = "laboratory";
    cost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "+1 Action";
    supplyCount = 10;
    cardArt = "/img/card-img/LaboratoryArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.draw(2);
        player.data.actions++;
    }
}
