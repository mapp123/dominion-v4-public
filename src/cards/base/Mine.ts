import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Mine extends Card {
    intrinsicTypes = ["action"] as const;
    name = "mine";
    intrinsicCost = {
        coin: 5
    };
    cardText = "You may trash a Treasure from your hand. Gain a Treasure to your hand costing up to $3 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/MineArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseATreasureToTrashFor('mine'), true, (card) => card.types.includes("treasure"));
        if (card) {
            await player.trash(card);
            await player.chooseGain(Texts.chooseCardToGainFor('mine'), false, GainRestrictions.instance().setUpToCost(card.cost.augmentBy(Cost.create(3))).setMustIncludeType('treasure'), 'hand');
        }
    }
}
