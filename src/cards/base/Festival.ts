import Card from "../Card";
import type Player from "../../server/Player";

export default class Festival extends Card {
    intrinsicTypes = ["action"] as const;
    name = "festival";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Actions\n" +
        "+1 Buy\n" +
        "+$2";
    supplyCount = 10;
    cardArt = "/img/card-img/FestivalArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.actions += 2;
        player.data.buys += 1;
        await player.addMoney(2);
    }
}
