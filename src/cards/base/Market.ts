import Card from "../Card";
import Player from "../../server/Player";

export default class Market extends Card {
    intrinsicTypes = ["action"] as const;
    name = "market";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+1 Buy\n" +
        "+$1";
    supplyCount = 10;
    cardArt = "/img/card-img/MarketArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        player.data.buys += 1;
        player.data.money += 1;
    }
}
