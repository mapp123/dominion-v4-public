import Card from "../Card";
import Player from "../../server/Player";

export default class Woodcutter extends Card {
    types = ["action"] as const;
    name = "woodcutter";
    cost = {
        coin: 3
    };
    cardText = "+1 Buy\n" +
        "+$2";
    supplyCount = 10;
    cardArt = "/img/card-img/WoodcutterArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.buys++;
        player.data.money += 2;
    }
}