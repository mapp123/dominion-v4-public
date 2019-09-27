import Card from "../Card";
import Player from "../../server/Player";

export default class PoorHouse extends Card {
    intrinsicTypes = ["action"] as const;
    name = "poor house";
    cost = {
        coin: 1
    };
    cardText = "+$4\n" +
        "Reveal your hand. –$1 per Treasure card in your hand.\n" +
        "(You can't go below $0.)";
    supplyCount = 10;
    cardArt = "/img/card-img/Poor_HouseArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.money += 4;
        player.data.hand = await player.reveal(player.data.hand);
        player.data.money -= player.data.hand.length;
        player.data.money = Math.max(0, player.data.money);
    }
}
