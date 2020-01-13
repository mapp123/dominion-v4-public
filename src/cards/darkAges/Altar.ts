import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Altar extends Card {
    intrinsicTypes = ["action"] as const;
    name = "altar";
    intrinsicCost = {
        coin: 6
    };
    cardText = "Trash a card from your hand. Gain a card costing up to $5.";
    supplyCount = 10;
    cardArt = "/img/card-img/AltarArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('altar'));
        if (card) {
            await player.trash(card);
        }
        await player.chooseGain(Texts.chooseCardToGainFor('altar'), false, GainRestrictions.instance().setUpToCost(Cost.create(5)));
    }
}
