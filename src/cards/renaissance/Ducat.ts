import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Ducat extends Card {
    types = ["treasure"] as const;
    name = "ducat";
    cost = {
        coin: 2
    };
    cardText = "+1 Coffers\n" +
        "+1 Buy";
    supplyCount = 10;
    cardArt = "/img/card-img/DucatArt.jpg";
    async onTreasure(player: Player): Promise<void> {
        player.data.coffers += 1;
        player.data.buys += 1;
    }
    async onGainSelf(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('ducat'), true);
        if (card) {
            await player.trash(card);
        }
    }
}
