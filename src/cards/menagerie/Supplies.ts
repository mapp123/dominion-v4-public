import Card from "../Card";
import type Player from "../../server/Player";

export default class Supplies extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "supplies";
    intrinsicCost = {
        coin: 2
    };
    cardText = "$1\n" +
        "When you play this, gain a Horse onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/SuppliesArt.jpg";
    static onChosen() {
        return ['horse'];
    }
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(1);
        await player.gain('horse', undefined, true, 'deck');
    }
}
