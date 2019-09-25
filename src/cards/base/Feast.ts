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
        if (player.data.playArea.some((a) => a.id === this.id)) {
            const card = player.data.playArea.splice(player.data.playArea.findIndex((a) => a.id === this.id), 1)[0];
            await player.trash(card);
        }
        await player.chooseGain(Texts.chooseCardToGainFor('feast'), false, GainRestrictions.instance().setMaxCoinCost(5));
    }
}
