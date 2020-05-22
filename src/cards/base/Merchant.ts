import Card from "../Card";
import type Player from "../../server/Player";

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
    async onPlay(player: Player): Promise<void> {
        await player.draw(1, true);
        player.data.actions++;
        this.cb = player.effects.setupEffect('cardPlayed', 'merchant', {
            compatibility: {
                citadel: true
            },
            relevant: (ctx, card) => card.viewCard().name === "silver"
        }, async (remove, cardTracker) => {
            if (cardTracker.viewCard().name === "silver") {
                await player.addMoney(1);
                remove();
            }
        });
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.cb) {
            player.effects.removeEffect('cardPlayed', 'merchant', this.cb);
        }
    }
}