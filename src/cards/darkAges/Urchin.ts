import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Urchin extends Card {
    static descriptionSize = 45;
    intrinsicTypes = ["action","attack"] as const;
    name = "urchin";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Each other player discards down to 4 cards in hand.\n" +
        "---\n" +
        "When you play another Attack card with this in play, you first may trash this, to gain a Mercenary from the Mercenary pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/UrchinArt.jpg";
    private sub: any = null;
    async onPlay(player: Player, exemptPlayers: Player[], tracker): Promise<void> {
        await player.draw(1, true);
        player.data.actions++;
        await player.attackOthers(exemptPlayers, async (p) => {
            while (p.data.hand.length > 4) {
                const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('urchin'));
                if (card) {
                    await p.discard(card);
                }
            }
        });
        this.sub = player.effects.setupEffect('willPlayCard', 'urchin', {
            relevant: (ctx, card) => tracker.hasTrack && card.types.includes("attack"),
            compatibility: {}
        }, async (remove, card) => {
            if (!tracker.hasTrack) {
                this.sub = null;
                remove();
            }
            else if (card.id !== this.id && card.types.includes("attack") && await player.confirmAction(Texts.doYouWantToTrashAToB('urchin', 'gain a mercenary'))) {
                await player.trash(tracker.exercise()!);
                await player.gain('mercenary');
                this.sub = null;
                remove();
            }
        });
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.sub) {
            player.effects.removeEffect('willPlayCard', 'urchin', this.sub);
            this.sub = null;
        }
    }
    public static onChosen() {
        return ['mercenary'];
    }
}
