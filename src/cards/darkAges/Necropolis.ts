import Card from "../Card";
import Player from "../../server/Player";

export default class Necropolis extends Card {
    intrinsicTypes = ["action","shelter"] as const;
    name = "necropolis";
    intrinsicCost = {
        coin: 1
    };
    cardText = "+2 Actions";
    supplyCount = 0;
    cardArt = "/img/card-img/NecropolisArt.jpg";
    randomizable = false;
    public static createSupplyPiles(): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        return [];
    }
    async onAction(player: Player): Promise<void> {
        player.data.actions += 2;
    }
}
