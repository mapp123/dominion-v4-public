import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Chapel extends Card {
    intrinsicTypes = ["action"] as const;
    name = "chapel";
    intrinsicCost = {
        coin: 2
    };
    cardText = "Trash up to 4 cards from your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/ChapelArt.jpg";
    async onAction(player: Player): Promise<void> {
        let cardsToTrash = 4;
        let card: Card | null;
        while (cardsToTrash > 0 && (card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('chapel'), true)) != null) {
            await player.trash(card);
            cardsToTrash--;
        }
    }
}