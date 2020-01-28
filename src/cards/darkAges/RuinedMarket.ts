import Card from "../Card";
import Player from "../../server/Player";

export default class RuinedMarket extends Card {
    intrinsicTypes = ["action","ruins"] as const;
    name = "ruined market";
    intrinsicCost = {
        coin: 0
    };
    cardText = "+1 Buy";
    supplyCount = 10;
    cardArt = "/img/card-img/Ruined_MarketArt.jpg";
    randomizable = false;
    async onAction(player: Player): Promise<void> {
        player.data.buys++;
    }
    public static createSupplyPiles(): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        return [];
    }
    getPileIdentifier(): string {
        return 'ruins';
    }
}
