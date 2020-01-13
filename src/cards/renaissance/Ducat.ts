import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Ducat extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "ducat";
    features = ["coffers"] as const;
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Coffers\n" +
        "+1 Buy\n" +
        "---\n" +
        "When you gain this, you may trash a Copper from your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/DucatArt.jpg";
    async onTreasure(player: Player): Promise<void> {
        player.data.coffers += 1;
        player.data.buys += 1;
    }
    async onGainSelf(player: Player): Promise<void> {
        if (player.data.hand.some((a) => a.name === 'copper') && await player.confirmAction(Texts.doYouWantToTrashA('copper'))) {
            const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.name === 'copper'), 1)[0];
            await player.trash(card);
        }
    }
}
