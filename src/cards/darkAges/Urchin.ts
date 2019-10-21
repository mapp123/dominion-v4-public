import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Urchin extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "urchin";
    cost = {
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
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        await player.attackOthers(exemptPlayers, async (p) => {
            while (p.data.hand.length > 4) {
                const card = await p.chooseCardFromHand(Texts.chooseCardToDiscardFor('urchin'));
                if (card) {
                    await p.discard(card);
                }
            }
        });
        this.sub = player.events.on('willPlayAction', async (card) => {
            if (player.data.playArea.find((a) => a.id === this.id) == null) {
                this.sub = null;
                return false;
            }
            if (card.id !== this.id && card.types.includes("attack") && await player.confirmAction(Texts.doYouWantToTrashAToB('urchin', 'gain a mercenary'))) {
                const me = player.data.playArea.splice(player.data.playArea.findIndex((a) => a.id === this.id), 1)[0];
                if (me) {
                    await player.trash(me);
                    await player.gain('mercenary');
                }
                this.sub = null;
                return false;
            }
            return true;
        });
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.sub) {
            player.events.off('willPlayAction', this.sub);
            this.sub = null;
        }
    }
    public static onChosen() {
        return ['mercenary'];
    }
}
