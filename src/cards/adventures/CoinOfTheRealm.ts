import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class CoinOfTheRealm extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["treasure","reserve"] as const;
    name = "coin of the realm";
    intrinsicCost = {
        coin: 2
    };
    intrinsicValue = 1;
    cardText = "$1\n" +
        "When you play this, put it on your Tavern mat.\n" +
        "---\n" +
        "Directly after you finish playing an Action card, you may call this, for +2 Actions.";
    supplyCount = 10;
    cardArt = "/img/card-img/Coin_of_the_RealmArt.jpg";
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        await player.addMoney(1);
        this.moveToTavernMat(player, tracker);
        player.effects.setupEffect('cardPlayed', 'coin of the realm', {
            compatibility: {
                merchant: true
            },
            relevant: (cardTracker) => cardTracker.viewCard().types.includes("action") && player.data.actions === 0 && player.data.hand.some((a) => a.types.includes("action"))
        }, async (remove) => {
            if (!player.data.tavernMat.some((a) => a.card.id === this.id)) {
                remove();
                return;
            }
            if (player.data.actions === 0 && player.data.hand.some((a) => a.types.includes("action")) && await player.confirmAction(Texts.doYouWantToCall('coin of the realm'))) {
                await this.call(player);
                remove();
            }
        });
    }
    async onCall(player: Player) {
        player.data.actions += 2;
    }
}
