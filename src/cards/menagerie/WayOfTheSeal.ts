import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";
import {Texts} from "../../server/Texts";

export default class WayOfTheSeal extends Way {
    cardArt = "/img/card-img/Way_of_the_SealArt.jpg";
    cardText = "+$1\n" +
        "This turn, when you gain a card, you may put it onto your deck.";
    name = "way of the seal";
    cb: Map<string, any> = new Map<string, any>();
    async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>): Promise<void> {
        await player.addMoney(1);
        if (!this.cb.has(player.id)) {
            const cb = player.effects.setupEffect('gain', this.name, {
                compatibility: {
                    duplicate: true,
                    'travelling fair': true,
                    exile: true,
                    'royal seal': true
                }
            }, async (unsub, card) => {
                if (tracker.hasTrack && await player.confirmAction(Texts.doYouWantToPutTheAOnYourDeck(card.viewCard().name))) {
                    player.deck.cards.unshift(card.exercise()!);
                }
            });
            this.cb.set(player.id, cb);
            player.events.on('turnStart', () => {
                player.effects.removeEffect('gain', this.name, cb);
                this.cb.delete(player.id);
                return false;
            });
        }
    }
}