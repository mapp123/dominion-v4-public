import Card from "../Card";
import Player from "../../server/Player";

export default class SilkMerchant extends Card {
    types = ["action"] as const;
    name = "silk merchant";
    cost = {
        coin: 4
    };
    cardText = "+2 Cards\n" +
        "+1 Buy";
    supplyCount = 10;
    cardArt = "/img/card-img/Silk_MerchantArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.draw(2);
        player.data.buys += 1;
    }
}
