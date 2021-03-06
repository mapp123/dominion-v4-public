import Card from "../Card";
import type Player from "../../server/Player";
import {GainRestrictions} from "../../server/GainRestrictions";
import {Texts} from "../../server/Texts";
import Cost from "../../server/Cost";

export default class Workshop extends Card {
    intrinsicTypes = ["action"] as const;
    name = "workshop";
    intrinsicCost = {
        coin: 3
    };
    cardText = "Gain a card costing up to $4.";
    supplyCount = 10;
    cardArt = "/img/card-img/WorkshopArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('workshop'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
    }
}