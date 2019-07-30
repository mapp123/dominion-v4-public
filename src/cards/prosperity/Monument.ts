import Card from "../Card";
import Player from "../../server/Player";

export default class Monument extends Card {
    types = ["action"] as const;
    name = "monument";
    features = ["vp"] as const;
    cost = {
        coin: 4
    };
    cardText = "+$2\n" +
        "+1 VP";
    supplyCount = 10;
    cardArt = "/img/card-img/MonumentArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        player.data.vp += 1;
    }
}