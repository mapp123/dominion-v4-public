import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class JunkDealer extends Card {
    intrinsicTypes = ["action"] as const;
    name = "junk dealer";
    cost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+$1\n" +
        "Trash a card from your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-Junk_DealerArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        player.data.money += 1;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('junk dealer'));
        if (card) {
            await player.trash(card, true);
        }
    }
}
