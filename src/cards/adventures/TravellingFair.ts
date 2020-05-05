import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";

export default class TravellingFair extends Event {
    cardArt = "/img/card-img/Travelling_FairArt.jpg";
    cardText = "+2 Buys\n" +
        "When you gain a card this turn, you may put it onto your deck.";
    intrinsicCost = {
        coin: 2
    };
    name = "travelling fair";
    async onPurchase(player: Player): Promise<any> {
        player.data.buys += 2;
        const cb = player.effects.setupEffect('gain', this.name, {
            compatibility: {
                duplicate: true,
                'royal seal': true // Royal Seal has the exact same effect, not worth asking
            }
        }, async (remove, card) => {
            if (card.hasTrack && await player.confirmAction(Texts.doYouWantToPutTheAOnYourDeck(card.viewCard().name))) {
                player.deck.cards.unshift(card.exercise()!);
            }
        });
        player.events.on('turnStart', () => {
            player.effects.removeEffect('gain', this.name, cb);
            return false;
        });
    }
}