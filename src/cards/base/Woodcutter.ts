import Card from "../Card";
import type Player from "../../server/Player";

export default class Woodcutter extends Card {
    intrinsicTypes = ["action"] as const;
    name = "woodcutter";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Buy\n" +
        "+$2";
    supplyCount = 10;
    cardArt = "/img/card-img/WoodcutterArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.buys++;
        player.data.money += 2;
    }
}