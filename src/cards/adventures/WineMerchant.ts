import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class WineMerchant extends Card {
    static descriptionSize = 50;
    intrinsicTypes = ["action","reserve"] as const;
    name = "wine merchant";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Buy\n" +
        "+$4\n" +
        "Put this on your Tavern mat.\n" +
        "---\n" +
        "At the end of your Buy phase, if you have at least $2 unspent, you may discard this from your Tavern mat.";
    supplyCount = 10;
    cardArt = "/img/card-img/WineMerchantArt.jpg";
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.buys++;
        player.data.money += 4;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            player.effects.setupEffect('buyEnd', this.name, {
                compatibility: {},
                temporalRelevance: () => player.data.money >= 2
            }, async (remove) => {
                if (player.data.tavernMat.findIndex((a) => a.card.id === this.id) === -1) {
                    remove();
                    return;
                }
                if (await player.confirmAction(Texts.doYouWantToRemoveFromTavernMat(this.name))) {
                    player.data.tavernMat.splice(player.data.tavernMat.findIndex((a) => a.card.id === this.id), 1);
                    await player.discard(this);
                    remove();
                }
            });
        }
    }
}
