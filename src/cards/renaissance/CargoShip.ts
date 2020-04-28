import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class CargoShip extends Card {
    static typelineSize = 63;
    intrinsicTypes = ["action", "duration"] as const;
    name = "cargo ship";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "Once this turn, when you gain a card, you may set it aside face up (on this). At the start of your next turn, put it into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/Cargo_ShipArt.jpg";
    holder = this.game && this.game.getCardHolder();
    private cb: any = null;
    async onPlay(player: Player): Promise<void> {
        player.data.money += 2;
        this.cb = player.effects.setupEffect('gain', 'cargo ship', {
            compatibility: {}
        }, async (remove, tracker) => {
            if (tracker.hasTrack && await player.confirmAction(Texts.wouldYouLikeToSetAsideThe(tracker.viewCard().name, 'cargo ship'))) {
                player.lm('%p sets aside the %s with cargo ship.', tracker.viewCard().name);
                this.holder.addCard(tracker.exercise()!);
                player.effects.setupEffect('turnStart', 'cargo ship', {
                    compatibility: {}
                }, async (remove2) => {
                    if (this.holder.getCards().length) player.data.hand.push(this.holder.popCard()!);
                    remove2();
                });
                remove();
            }
        });
    }

    async onDiscardFromPlay(player: Player): Promise<any> {
        if (this.cb) {
            player.effects.removeEffect('gain', 'cargo ship', this.cb);
        }
    }

    shouldDiscardFromPlay(): boolean {
        return this.holder.getCards().length === 0;
    }
}
