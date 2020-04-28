import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Sculptor extends Card {
    intrinsicTypes = ["action"] as const;
    name = "sculptor";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Gain a card to your hand costing up to $4. If it's a Treasure, \n" +
        "+1 Villager.";
    features = ["villagers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/SculptorArt.jpg";
    async onPlay(player: Player): Promise<void> {
        const card = await player.chooseGain(Texts.chooseCardToGainFor('sculptor'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
        if (card && card.types.includes("treasure")) {
            player.data.villagers++;
        }
    }
}
