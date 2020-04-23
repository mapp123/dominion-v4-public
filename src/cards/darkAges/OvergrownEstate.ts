import Card from "../Card";
import type Player from "../../server/Player";

export default class OvergrownEstate extends Card {
    intrinsicTypes = ["victory","shelter"] as const;
    name = "overgrown estate";
    intrinsicCost = {
        coin: 1
    };
    cardText = "0 VP\n" +
        "---\n" +
        "When you trash this, +1 Card.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-Overgrown_EstateArt.jpg";
    randomizable = false;
    async onTrashSelf(player: Player): Promise<void> {
        await player.draw(1);
    }
    public static createSupplyPiles(): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        return [];
    }
    getPileIdentifier(): string {
        return 'SPECIAL_NO_PILE';
    }
}
