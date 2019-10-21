import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Armory extends Card {
    intrinsicTypes = ["action"] as const;
    name = "armory";
    cost = {
        coin: 4
    };
    cardText = "Gain a card onto your deck costing up to $4.";
    supplyCount = 10;
    cardArt = "/img/card-img/ArmoryArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('armory'), false, GainRestrictions.instance().setMaxCoinCost(4), 'deck');
    }
}
