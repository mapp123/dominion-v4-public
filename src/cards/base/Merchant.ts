import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Merchant extends Card {
    types = ["action"] as const;
    name = "merchant";
    cost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "The first time you play a Silver this turn, +$1.";
    supplyCount = 10;
    cardArt = "/img/card-img/MerchantArt.jpg";
    cb: ((player: Player, card: Card) => boolean | Promise<boolean>) | null = null;
    async onAction(player: Player): Promise<void> {
        player.draw(1);
        player.data.actions++;
        this.cb = player.events.on('treasureCardPlayed', (player, card) => {
            if (card.name === "silver") {
                player.data.money += 1;
                return false;
            }
            return true;
        });
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.cb) {
            player.events.off('treasureCardPlayed', this.cb);
        }
    }
}