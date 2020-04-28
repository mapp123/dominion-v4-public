import Card from "../Card";
import type Player from "../../server/Player";

export default class RuinedLibrary extends Card {
    intrinsicTypes = ["action","ruins"] as const;
    name = "ruined library";
    intrinsicCost = {
        coin: 0
    };
    cardText = "+1 Card";
    supplyCount = 10;
    cardArt = "/img/card-img/Ruined_LibraryArt.jpg";
    randomizable = false;
    async onPlay(player: Player): Promise<void> {
        await player.draw(1);
    }
    public static createSupplyPiles(): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        return [];
    }
    getPileIdentifier(): string {
        return 'ruins';
    }
}
