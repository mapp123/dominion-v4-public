import Card from "../Card";
import type Player from "../../server/Player";

export default class TreasureTrove extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "treasure trove";
    intrinsicCost = {
        coin: 5
    };
    cardText = "$2\n" +
        "When you play this, gain a Gold and a Copper.";
    supplyCount = 10;
    cardArt = "/img/card-img/Treasure_TroveArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(2);
        await player.gain('gold');
        await player.gain('copper');
    }
}
