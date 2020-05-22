import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";

export default class WayOfTheFrog extends Way {
    cardArt = "/img/card-img/Way_of_the_FrogArt.jpg";
    cardText = "+1 Action\n" +
        "When you discard this from play this turn, put it onto your deck.";
    name = "way of the frog";
    async onWay(player: Player, exemptPlayers: Player[], t: Tracker<Card>): Promise<void> {
        player.data.actions++;
        player.effects.setupEffect('discardFromPlay', this.name, {
            compatibility: {},
            relevant: (ctx, tracker) => tracker.viewCard().id === t.viewCard().id,
            temporalRelevance: (ctx, tracker) => tracker.hasTrack
        }, async (unsub, tracker) => {
            unsub();
            if (tracker.hasTrack) {
                player.deck.cards.unshift(tracker.exercise()!);
            }
        });
    }
}