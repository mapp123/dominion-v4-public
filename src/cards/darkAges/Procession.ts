import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Procession extends Card {
    intrinsicTypes = ["action"] as const;
    name = "procession";
    intrinsicCost = {
        coin: 4
    };
    cardText = "You may play a non-Duration Action card from your hand twice. Trash it. Gain an Action card costing exactly $1 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/ProcessionArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayTwice, true, (card) => !card.types.includes("duration"));
        if (card) {
            player.lm('%p chooses %s.', Util.formatCardList([card.name]));
            player.data.playArea.push(card);
            const tracker = player.getTrackerInPlay(card);
            await player.playActionCard(card, tracker);
            await player.replayActionCard(card, tracker);
            if (tracker.hasTrack) {
                await player.trash(tracker.exercise()!);
            }
            await player.chooseGain(Texts.chooseCardToGainFor('procession'), false, GainRestrictions.instance().setExactCost(card.cost.augmentBy(Cost.create(1))));
        }
    }
}
