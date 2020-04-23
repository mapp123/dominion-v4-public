import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Rats extends Card {
    static descriptionSize = 54;
    intrinsicTypes = ["action"] as const;
    name = "rats";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Gain a Rats. Trash a card from your hand other than a Rats (or reveal a hand of all Rats).\n" +
        "---\n" +
        "When you trash this, +1 Card.";
    supplyCount = 20;
    cardArt = "/img/card-img/RatsArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        await player.gain('rats');
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('rats'), false, (a) => a.name != 'rats');
        if (card) {
            await player.trash(card);
        }
        else {
            player.lm('%p reveals a hand of all Rats.');
        }
    }
    async onTrashSelf(player: Player): Promise<void> {
        await player.draw();
    }
}
