import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Hideout extends Card {
    types = ["action"] as const;
    name = "hideout";
    cost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+2 Actions\n" +
        "Trash a card from your hand. If it's a Victory card, gain a Curse.";
    supplyCount = 10;
    cardArt = "/img/card-img/HideoutArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.draw();
        player.data.actions += 2;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('hideout'));
        if (card) {
            await player.trash(card);
            if (card.types.includes('victory')) {
                await player.gain('curse');
            }
        }
    }
}
