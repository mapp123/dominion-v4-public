import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Ducat extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "ducat";
    features = ["coffers"] as const;
    cost = {
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
        let card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('ducat'), true);
        while (card && !Util.checkTrashSanity(card, player.data.hand) && !await player.confirmAction(Texts.areYouSureYouWantToTrash(card.name))) {
            player.data.hand.push(card);
            card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('ducat'), true);
        }
        if (card) {
            await player.trash(card);
        }
    }
}
