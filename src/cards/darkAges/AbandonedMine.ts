import Card from "../Card";
import Player from "../../server/Player";

export default class AbandonedMine extends Card {
    intrinsicTypes = ["action","ruins"] as const;
    name = "abandoned mine";
    intrinsicCost = {
        coin: 0
    };
    cardText = "+$1";
    supplyCount = 10;
    cardArt = "/img/card-img/Abandoned_MineArt.jpg";
    randomizable = false;
    async onAction(player: Player): Promise<void> {
        player.data.money++;
    }
    public static createSupplyPiles(): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        return [];
    }
}
