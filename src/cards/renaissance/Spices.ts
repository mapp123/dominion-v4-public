import Card from "../Card";
import Player from "../../server/Player";

export default class Spices extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "spices";
    cost = {
        coin: 5
    };
    cardText = "+$2\n" +
        "+1 Buy\n" +
        "---\n" +
        "When you gain this,\n" +
        "+2 Coffers";
    features = ["coffers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/SpicesArt.jpg";
    async onTreasure(player: Player): Promise<void> {
        player.data.money += 2;
        player.data.buys += 1;
    }
    onGainSelf(player: Player): Promise<void> | void {
        player.data.coffers += 2;
    }
}
