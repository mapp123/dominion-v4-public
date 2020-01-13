import Card from "../Card";
import Player from "../../server/Player";
import {GainRestrictions} from "../../server/GainRestrictions";
import {Texts} from "../../server/Texts";

export default class Workshop extends Card {
    intrinsicTypes = ["action"] as const;
    name = "workshop";
    intrinsicCost = {
        coin: 3
    };
    cardText = "Gain a card costing up to $4.";
    supplyCount = 10;
    cardArt = "/img/card-img/WorkshopArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('workshop'), false, GainRestrictions.instance().setMaxCoinCost(4));
    }
}