import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class CargoShip extends Card {
    types = ["action"] as const;
    name = "cargo ship";
    cost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "Once this turn, when you gain a card, you may set it aside face up (on this). At the start of your next turn, put it into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/Cargo_ShipArt.jpg";
    holder = this.game && this.game.getCardHolder();
    private cb: any = null;
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        this.cb = player.events.on('gain', async (card, hasTrack, loseTrack) => {
            if (hasTrack.hasTrack && await player.confirmAction(Texts.wouldYouLikeToSetAsideThe(card.name, 'cargo ship'))) {
                player.lm('%p sets aside the %s with cargo ship.', card.name);
                loseTrack();
                this.holder.addCard(card);
                player.events.on('turnStart', () => {
                    if (this.holder.getCards().length) {
                        player.data.hand.push(this.holder.popCard()!);
                    }
                    return false;
                });
                return false;
            }
            return true;
        });
    }

    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.cb) {
            player.events.off('gain', this.cb);
        }
    }

    shouldDiscardFromPlay(): boolean {
        return this.holder.getCards().length === 0;
    }
}
