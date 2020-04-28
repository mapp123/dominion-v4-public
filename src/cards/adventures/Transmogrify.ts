import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Transmogrify extends Card {
    static descriptionSize = 51;
    intrinsicTypes = ["action","reserve"] as const;
    name = "transmogrify";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Action\n" +
        "Put this on your Tavern mat.\n" +
        "---\n" +
        "At the start of your turn, you may call this, to trash a card from your hand, and gain a card to your hand costing up to $1 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-TransmogrifyArt.jpg";
    cb: any = null;
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        player.data.actions++;
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            this.allowCallAtEvent(player, tracker, 'turnStart', {
                compatibility: {
                    ratcatcher: true,
                    teacher: true,
                    guide: true
                }
            });
        }
    }
    async onCall(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('transmogrify'));
        if (card) {
            await player.trash(card);
            await player.chooseGain(Texts.chooseCardToGainFor('transmogrify'), false, GainRestrictions.instance().setUpToCost(card.cost.augmentBy(Cost.create(1))), 'hand');
        }
    }
}
