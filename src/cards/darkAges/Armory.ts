import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Armory extends Card {
    intrinsicTypes = ["action"] as const;
    name = "armory";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Gain a card onto your deck costing up to $4.";
    supplyCount = 10;
    cardArt = "/img/card-img/ArmoryArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('armory'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)), 'deck');
    }
}
