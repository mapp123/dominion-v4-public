import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class MountainVillage extends Card {
    intrinsicTypes = ["action"] as const;
    name = "mountain village";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+2 Actions\n" +
        "Look through your discard pile and put a card from it into your hand; if you can't, \n" +
        "+1 Card.";
    supplyCount = 10;
    cardArt = "/img/card-img/Mountain_VillageArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 2;
        const card = await player.chooseCardFromDiscard(Texts.chooseCardToTakeFromDiscard, false);
        if (card) {
            player.lm('%p takes %s.', Util.formatCardList([card.name]));
            player.data.hand.push(card);
        }
        else {
            await player.draw(1);
        }
    }
}
