import Card from "../Card";
import type Player from "../../server/Player";

export default class Spices extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "spices";
    intrinsicCost = {
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
    intrinsicValue = 2;
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(2);
        player.data.buys += 1;
    }
    onGainSelf(player: Player): Promise<void> | void {
        player.data.coffers += 2;
    }
}
