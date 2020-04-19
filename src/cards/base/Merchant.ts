import Card from "../Card";
import Player from "../../server/Player";

export default class Merchant extends Card {
    intrinsicTypes = ["action"] as const;
    name = "merchant";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "The first time you play a Silver this turn, +$1.";
    supplyCount = 10;
    cardArt = "/img/card-img/MerchantArt.jpg";
    cb: any | null = null;
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        this.cb = player.effects.setupEffect('treasureCardPlayed', 'merchant', {
            compatibility: {},
            relevant: (card) => card.name === "silver"
        }, async (remove, card) => {
            if (card.name === "silver") {
                player.data.money += 1;
                remove();
            }
        });
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.cb) {
            player.effects.removeEffect('treasureCardPlayed', 'merchant', this.cb);
        }
    }
}