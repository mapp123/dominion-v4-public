import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Traveller from "./Traveller.abstract";

export default class Hero extends Traveller {
    static descriptionSize = 56;
    intrinsicTypes = ["action","traveller"] as const;
    name = "hero";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$2\n" +
        "Gain a Treasure.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Champion.\n" +
        "(This is not in the Supply.)";
    supplyCount = 5;
    cardArt = "/img/card-img/800px-HeroArt.jpg";
    randomizable = false;
    static inSupply = false;
    travellerTarget = "champion";
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        await player.chooseGain(Texts.chooseCardToGainFor('hero'), false, GainRestrictions.instance().setMustIncludeType('treasure'));
    }
}
