import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Feast extends Card {
    intrinsicTypes = ["action"] as const;
    name = "feast";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Trash this card.\n" +
        "Gain a card costing up to $5.";
    supplyCount = 10;
    cardArt = "/img/card-img/FeastArt.jpg";
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        if (tracker.hasTrack) {
            await player.trash(tracker.exercise()!);
        }
        await player.chooseGain(Texts.chooseCardToGainFor('feast'), false, GainRestrictions.instance().setUpToCost(Cost.create(5)));
    }
}
