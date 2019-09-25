import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Feast extends Card {
    intrinsicTypes = ["action"] as const;
    name = "feast";
    cost = {
        coin: 4
    };
    cardText = "Trash this card.\n" +
        "Gain a card costing up to $5.";
    supplyCount = 10;
    cardArt = "/img/card-img/FeastArt.jpg";
    async onAction(player: Player): Promise<void> {
        if (player.data.playArea.includes(this)) {
            player.data.playArea.splice(player.data.playArea.indexOf(this), 1);
            await player.trash(this);
        }
        await player.chooseGain(Texts.chooseCardToGainFor('feast'), false, GainRestrictions.instance().setMaxCoinCost(5));
    }
}
