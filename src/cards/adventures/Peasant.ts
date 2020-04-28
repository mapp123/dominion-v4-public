import type Player from "../../server/Player";
import Traveller from "./Traveller.abstract";

export default class Peasant extends Traveller {
    static typelineSize = 63;
    intrinsicTypes = ["action","traveller"] as const;
    name = "peasant";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Buy\n" +
        "+$1\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Soldier.";
    supplyCount = 10;
    cardArt = "/img/card-img/PeasantArt.jpg";
    travellerTarget = "soldier";
    async onPlay(player: Player): Promise<void> {
        player.data.buys++;
        player.data.money++;
    }
}
