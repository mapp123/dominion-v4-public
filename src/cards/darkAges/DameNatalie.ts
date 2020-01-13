import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Knight from "./Knight.abstract";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class DameNatalie extends Knight {
    static descriptionSize = 56;
    static typelineSize = 47;
    intrinsicTypes = ["action","attack","knight"] as const;
    name = "dame natalie";
    intrinsicCost = {
        coin: 5
    };
    cardText = "You may gain a card costing up to $3. Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/800px-Dame_NatalieArt.jpg";
    async beforeKnight(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('dame natalie'), true, GainRestrictions.instance().setUpToCost(Cost.create(3)));
    }
}
