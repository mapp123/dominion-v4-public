import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";
import {Texts} from "../../server/Texts";
import { GainRestrictions } from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class WayOfTheButterfly extends Way {
    static nameSize = 23;
    cardArt = "/img/card-img/Way_of_the_ButterflyArt.jpg";
    cardText = "You may return this to its pile to gain a card costing exactly $1 more than it.";
    name = "way of the butterfly";
    async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>): Promise<void> {
        if (tracker.hasTrack) {
            if (tracker.viewCard().getPileIdentifier() != null) {
                const card = tracker.exercise()!;
                const pile = player.game.supply.getPile(card.getPileIdentifier()!);
                if (pile) {
                    pile.unshift(card);
                    await player.chooseGain(Texts.chooseCardToGainFor('way of the butterfly'), false, GainRestrictions.instance().setExactCost(card.cost.augmentBy(Cost.create(1))));
                }
                else {
                    player.lm('%s has no pile to go back to.', card.name);
                }
            }
            else {
                player.lm('%s has no pile to go back to.', tracker.viewCard().name);
            }
        }
    }
}