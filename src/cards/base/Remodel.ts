import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Remodel extends Card {
    intrinsicTypes = ["action"] as const;
    name = "remodel";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Trash a card from your hand.\n" +
        "Gain a card costing up to $2 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/RemodelArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('remodel'));
        if (card) {
            await player.trash(card);
            await player.chooseGain(Texts.chooseCardToGainFor('remodel'), false, GainRestrictions.instance().setUpToCost(card.cost.augmentBy(Cost.create(2))));
        }
    }
}
