import Card from "../Card";
import type Player from "../../server/Player";

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
    getPileIdentifier(): string {
        return 'SPECIAL_NO_PILE';
    }
    async onPlay(player: Player): Promise<void> {
        player.data.actions += 2;
    }
}
