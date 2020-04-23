import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Graverobber extends Card {
    static descriptionSize = 58;
    intrinsicTypes = ["action"] as const;
    name = "graverobber";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Choose one: Gain a card from the trash costing from $3 to $6, onto your deck; or trash an Action card from your hand and gain a card costing up to $3 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/GraverobberArt.jpg";
    async onAction(player: Player): Promise<void> {
        const benefits = ["Gain a card from the trash", Texts.trashA('action card') + " and gain a card costing up to $3 more"] as const;
        const chosen = await player.chooseOption(Texts.chooseBenefitFor('graverobber'), benefits);
        switch (chosen) {
            case benefits[0]: // Gain from Trash
                const lowerRange = Cost.create(3);
                const upperRange = Cost.create(6);
                const card = await player.chooseCard(Texts.chooseCardToGainFor('graverobber'), Util.deduplicateByName(player.game.trash), false, (card) => {
                    return card.cost.isInRange(lowerRange, upperRange);
                });
                if (card) {
                    player.game.trash.splice(player.game.trash.findIndex((a) => a.id === card.id), 1);
                    await player.gain(card.name, card, true, 'deck');
                }
                break;
            case benefits[1]: // Trash an action card and gain
                const handCard = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('graverobber'), false, (card) => card.types.includes("action"));
                if (handCard) {
                    await player.trash(handCard);
                    await player.chooseGain(Texts.chooseCardToGainFor('graverobber'), false, GainRestrictions.instance().setUpToCost(handCard.cost.augmentBy(Cost.create(3))));
                }
                break;
        }
    }
}
