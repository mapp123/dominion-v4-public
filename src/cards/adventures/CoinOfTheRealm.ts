import Card from "../Card";
import Player from "../../server/Player";
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
    async onTreasure(player: Player, tracker): Promise<void> {
        player.data.money += 1;
        this.moveToTavernMat(player, tracker);
        player.events.on('actionCardPlayed', async () => {
            if (player.data.actions === 0 && player.data.hand.some((a) => a.types.includes("action")) && await player.confirmAction(Texts.doYouWantToCall('coin of the realm'))) {
                this.call(player);
                return false;
            }
            return player.data.tavernMat.some((a) => a.card.id === this.id);
        });
    }
    async onCall(player: Player) {
        player.data.actions += 2;
    }
}
