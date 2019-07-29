import Card from "../Card";
import Player from "../../server/Player";

export default class Festival extends Card {
    types = ["action"] as const;
    name = "festival";
    cost = {
        coin: 5
    };
    cardText = "+2 Actions\n" +
        "+1 Buy\n" +
        "+$2";
    supplyCount = 10;
    cardArt = "/img/card-img/FestivalArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 2;
        player.data.buys += 1;
        player.data.money += 2;
    }
}
